import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './modules/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { LoggingInterceptor } from './utils/interceptors/logging.interceptor';
import { ErrorsInterceptor } from './utils/interceptors/error.interceptor';
import { GoogleAuthenticationModule } from './modules/google-authentication/google-authentication.module';
import { AuthenModule } from './modules/authen/authen.module';
import { User } from './modules/user/entity/user.entity';
import { AppGateway } from './app.gateway';
import { RoomsModule } from './modules/rooms/rooms.module';
import { MessageModule } from './modules/message/message.module';
import { Room } from './modules/rooms/entity/room.entity';
import { Message } from './modules/message/entity/message.entity';
import { CameraModule } from './modules/camera/camera.module';
import { Warning } from './modules/warning/entity/warning.entity';
import { Camera } from './modules/camera/entity/camera.entity';
import { Home } from './modules/home/entity/home.entity';
import { Statistic } from './modules/statistic/entity/statistic.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'postgres',
        port: configService.get('PORT_POSTGRES_DOCKER'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: true,
        entities: [User, Room, Message, Warning, Camera, Home, Statistic],
      }),
    }),
    MailModule,
    UserModule,
    PostModule,
    GoogleAuthenticationModule,
    AuthenModule,
    RoomsModule,
    MessageModule,
    CameraModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ErrorsInterceptor,
    },
    AppGateway,
  ],
})
export class AppModule {}
