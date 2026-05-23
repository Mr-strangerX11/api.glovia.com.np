import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User } from '../../database/schemas/user.schema';
export declare class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private configService;
    private userModel;
    server: Server;
    private logger;
    constructor(jwtService: JwtService, configService: ConfigService, userModel: Model<User>);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribe(client: Socket, data: {
        channel: string;
    }): {
        status: string;
        channel: string;
    };
    handleUnsubscribe(client: Socket, data: {
        channel: string;
    }): {
        status: string;
        channel: string;
    };
    emitToChannel(channel: string, event: string, data: any): void;
    broadcastEvent(event: string, data: any): void;
}
