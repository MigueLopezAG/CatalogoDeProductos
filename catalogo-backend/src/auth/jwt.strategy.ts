import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

  //Function to decrypt and validate the JWT
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(private configService: ConfigService) {
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'secretKey',
    });
  }

  validate(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}