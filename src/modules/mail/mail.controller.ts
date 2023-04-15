import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from 'commons/types';
import { JwtAuthenGuard } from 'src/commons/guards/jwt.authen.guard';
import { UserService } from '../user/user.service';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('sendMail')
  async sendMail(@Query('email') email: string) {
    const mail = {
      from: 'knabao7a7@gmail.com',
      to: email,
      text: 'text official 2',
      html: '<h1>html official 2</h1>',
      subject: 'subject official 2',
    };

    return await this.mailService.sendEmail(mail);
  }

  @Get('verify-email')
  async confirmEmail(@Query('token') token: string) {
    const email = await this.mailService.decodeEmailToken(token);
    return await this.mailService.confirmEmail(email);
  }

  @Post('resend-verify-email')
  @UseGuards(JwtAuthenGuard)
  async resendVerifyEmail(@Req() request: RequestWithUser) {
    const { user } = request;
    return await this.mailService.resendVericationEmail(user.id);
  }
}
