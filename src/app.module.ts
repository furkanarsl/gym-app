import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'furkana',
      password: '0071',
      database: 'gym',
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
