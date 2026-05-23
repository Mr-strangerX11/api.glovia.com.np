import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../../database/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          try {
            if (!req) return null;
            // Prefer cookie if present
            if (req.cookies && req.cookies.access_token) return req.cookies.access_token;
            const cookieHeader = req.headers?.cookie;
            if (cookieHeader) {
              const match = cookieHeader
                .split(';')
                .map((part: string) => part.trim())
                .find((part: string) => part.startsWith('access_token='));
              if (match) return decodeURIComponent(match.slice('access_token='.length));
            }
            // Fallback to Authorization header
            const auth = req.headers?.authorization;
            if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
          } catch (e) {
            return null;
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userModel
      .findById(new Types.ObjectId(payload.sub))
      .select('email phone firstName lastName role profileImage')
      .lean();

    if (!user) {
      return null;
    }

    const { _id, ...userWithoutId } = user as any;
    return {
      id: _id?.toString() || payload.sub,
      ...userWithoutId,
    };
  }
}
