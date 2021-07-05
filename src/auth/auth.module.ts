import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './jwt-strategy';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'DSAFSDFSGSAAS', // TODO MOVE TO SECRET
      signOptions: { algorithm: 'HS256', expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, RolesGuard],
  exports: [JwtModule],
})
export class AuthModule {}
