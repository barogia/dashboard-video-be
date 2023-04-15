import { Module } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleAuthenticationController } from './google-authentication.controller';
import { UserModule } from '../user/user.module';
import { AuthenModule } from '../authen/authen.module';

@Module({
  imports: [UserModule, AuthenModule],
  controllers: [GoogleAuthenticationController],
  providers: [GoogleAuthenticationService],
})
export class GoogleAuthenticationModule {}
