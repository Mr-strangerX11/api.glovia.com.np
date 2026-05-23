import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../database/schemas/user.schema';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('RealtimeGateway');

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Authenticate client on connection
    try {
      const token =
        client.handshake?.auth?.token ||
        (client.handshake?.headers?.authorization?.startsWith('Bearer ')
          ? client.handshake.headers.authorization.slice(7)
          : undefined) ||
        (client.handshake?.headers?.cookie &&
          (() => {
            const cookieHeader = client.handshake.headers.cookie as string;
            const match = cookieHeader
              .split(';')
              .map((p) => p.trim())
              .find((p) => p.startsWith('access_token='));
            if (match) return decodeURIComponent(match.slice('access_token='.length));
            return undefined;
          })());

      if (!token) {
        this.logger.warn(`Client ${client.id} missing token`);
        // Optionally allow anonymous connections; for now disconnect
        client.disconnect(true);
        return;
      }

      const payload: any = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = this.userModel
        .findById(new Types.ObjectId(payload.sub))
        .select('email firstName lastName role')
        .lean();
      Promise.resolve(user)
        .then((u) => {
          if (!u) {
            client.disconnect(true);
            return;
          }
          client.data.user = {
            id: (u as any)._id.toString(),
            email: (u as any).email,
            role: (u as any).role,
          };
          this.logger.log(
            `Client ${client.id} authenticated as user ${(client.data.user as any).id}`
          );
        })
        .catch((err) => {
          this.logger.warn(`Auth error for client ${client.id}: ${err?.message || err}`);
          client.disconnect(true);
        });
    } catch (err) {
      this.logger.warn(`Client ${client.id} failed auth: ${err?.message || err}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, data: { channel: string }) {
    if (!client.data.user) throw new UnauthorizedException('Not authenticated');
    client.join(data.channel);
    this.logger.log(`Client ${client.id} subscribed to ${data.channel}`);
    return { status: 'subscribed', channel: data.channel };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, data: { channel: string }) {
    if (!client.data.user) throw new UnauthorizedException('Not authenticated');
    client.leave(data.channel);
    this.logger.log(`Client ${client.id} unsubscribed from ${data.channel}`);
    return { status: 'unsubscribed', channel: data.channel };
  }

  // Public method to emit events to clients
  emitToChannel(channel: string, event: string, data: any) {
    this.server.to(channel).emit(event, data);
    this.logger.log(`Emitted ${event} to channel ${channel}`);
  }

  // Broadcast to all connected clients
  broadcastEvent(event: string, data: any) {
    this.server.emit(event, data);
  }
}
