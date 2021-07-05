import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'DSAFSDFSGSAAS',
      ignoreExpiration: false,
    }); // TODO MOVE SECRET
  }

  async validate(payload: any) {
    console.log(payload);
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
