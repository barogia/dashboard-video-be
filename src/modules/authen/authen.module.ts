import { Module } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { AuthenController } from './authen.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/commons/stragies/jwt.strategy';
import { LocalStrategy } from 'src/commons/stragies/local.strategy';
import { JwtRefreshTokenStrategy } from 'src/commons/stragies/jwt-refresh.strategy';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  controllers: [AuthenController],
  providers: [
    AuthenService,
    JwtStrategy,
    LocalStrategy,
    JwtRefreshTokenStrategy,
  ],
  exports: [AuthenService],
})
export class AuthenModule {}
