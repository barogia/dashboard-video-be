import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenVerificationDto } from './dto/google.dto';
import { GoogleAuthenticationService } from './google-authentication.service';

@Controller('google-authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  async authenticate(@Body() tokenData: TokenVerificationDto) {
    const { token } = tokenData;

    const { accessToken, refreshToken, user } =
      await this.googleAuthenticationService.authenticate(token);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
