import {
  BadRequestException,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as SendGrid from '@sendgrid/mail';
import { UserService } from '../user/user.service';
import { EmailVerificationTokenPayload } from './dto/mail.dto';
@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    SendGrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }
  private logger = new Logger();

  async sendEmail(mail: SendGrid.MailDataRequired) {
    const mailTemplate = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@300;400;700&display=swap" rel="stylesheet">
      <title>Recover OTP password</title>

      <style>
        body {
          box-sizing: border-box !important;
          margin: 0 !important;
        }

        .container {
          max-width: 600px !important;
          margin: auto !important;
          font-family: 'Lexend Deca', sans-serif !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          color: #0b0b0b !important;
          font-weight: 400 !important;
        }

        @media only screen and (max-width: 565px) {
          .container {
            font-size: 14px !important;
          }

          .div-2 {
            padding: 32px !important;
          }

          .div-5 {
            font-size: 20px !important;
            font-weight: 600 !important;
          }

          .div-15 {
            bottom: 10% !important;
          }
        }
      </style>
    </head>

    <body>
      <div class="container">
        <div class="div" style=" max-width: 600px; background-color: rgba(255, 255, 255, 1);">
          <div class="div-2"
            style=" max-width: 600px; padding-top: 48px; padding-right: 56px; padding-bottom: 48px; padding-left: 56px;">
            <div class="div-3"
              style=" max-width: 100%; align-self: stretch;  border-radius: 16px; background-color: rgba(22, 22, 22, 0);">
              <div class="div-4" style=" max-width: 100%; align-self: stretch; ">
                <div class="div-5"
                  style="max-width: 100%; align-self: stretch; font-weight: bold; color: rgba(0, 0, 0, 1); font-size: 36px; letter-spacing: 0%; text-align: center;">
                  Đổi mật khẩu thành công</div>
                <div class="div-image"
                  style=" position: relative; min-width: 20px; min-height: 20px; max-width: 126px; width: 126px; margin-top: 10px;  margin: 0 auto;">
                  <picture>
                    <source srcset="
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?format=webp&width=100   100w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?format=webp&width=200   200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?format=webp&width=400   400w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?format=webp&width=800   800w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?format=webp&width=1200 1200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?format=webp&width=1600 1600w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?format=webp&width=2000 2000w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735
                      " type="image/webp">
                    <img loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735" srcset="
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?width=100   100w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?width=200   200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?width=400   400w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?width=800   800w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?width=1200 1200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?width=1600 1600w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735?width=2000 2000w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F4bcdbbe065444bfaab21ed3e37a09735
                      " class="image"
                      style="object-fit: cover; object-position: center; position: absolute; height: 100%; width: 100%; top: 0; left: 0;">
                  </picture>
                </div>
                <div class="div-6" style=" max-width: 100%; align-self: stretch; margin-top: 10px;">
                  <div class="xin-chao-username-bạn-vừa-g"
                    style=" max-width: 100%; align-self: stretch; color: rgba(0, 0, 0, 1); line-height: 24px; letter-spacing: 1%; text-align: left;">
                    Xin chào <span style="font-weight: bold;">${'Something'},</span>
                  </div>
                  <div class="xin-chao-username-bạn-vừa-g"
                    style=" max-width: 100%; align-self: stretch; margin-top: 10px; color: rgba(0, 0, 0, 1); line-height: 24px; letter-spacing: 1%; text-align: left;">
                    Yêu cầu đổi mật khẩu của bạn cho tài khoản MerriTrade đã thành công.
                  </div>
                  <div class="bạn-vui-long-khong-tiết-lộ-otp"
                    style=" max-width: 100%; align-self: stretch; margin-top: 10px; color: rgba(0, 0, 0, 1); line-height: 24px; letter-spacing: 1%; text-align: left;">
                    Chúc bạn có trải nghiệm vui vẻ tại MerriTrade. Trong trường hợp, bạn không phải người gửi yêu cầu này,
                    hãy
                    liên hệ ngay với Admin MerriTrade fanpage để chúng tôi có thể hỗ trợ bạn.
                  </div>
                  <div class="bạn-vui-long-khong-tiết-lộ-otp"
                    style=" max-width: 100%; align-self: stretch; margin-top: 10px; color: rgba(0, 0, 0, 1); line-height: 24px; letter-spacing: 1%; text-align: left;">
                    Trân trọng,
                  </div>
                  <div class="bạn-vui-long-khong-tiết-lộ-otp"
                    style=" max-width: 100%; align-self: stretch; margin-top: 10px; color: rgba(0, 0, 0, 1); line-height: 24px; letter-spacing: 1%; text-align: left; font-weight: bold;">
                    MerriTrade Support Team
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="div-8"
            style=" align-self: stretch; position: relative; min-width: 20px; min-height: 5px; max-width: 600px;">
            <picture>
              <source srcset="
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?format=webp&width=100   100w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?format=webp&width=200   200w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?format=webp&width=400   400w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?format=webp&width=800   800w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?format=webp&width=1200 1200w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?format=webp&width=1600 1600w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?format=webp&width=2000 2000w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6
                " type="image/webp">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6"
                srcset="
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?width=100   100w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?width=200   200w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?width=400   400w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?width=800   800w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?width=1200 1200w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?width=1600 1600w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6?width=2000 2000w,
                  https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F27eb6ec8c27f4725aa331fa094776ef6
                " class="image"
                style="object-fit: cover; object-position: center; position: absolute; height: 100%; width: 100%; top: 0; left: 0;">
            </picture>
            <div class="builder-image-sizer image-sizer"
              style="width: 100%; padding-top: 0.6666666666666667%; pointer-events: none; font-size: 0;"></div>
          </div>
          <div class="div-9" style=" max-width: 100%; align-self: stretch; width: 600px;">
            <div class="div-10"
              style=" max-width: 100%; align-self: stretch;padding-top: 24px; padding-right: 56px; padding-bottom: 24px; padding-left: 56px;">
              <div class="div-11" style="margin: 0 auto">
                <div class="div-12"
                  style="color: rgba(0, 0, 0, 1); font-size: 14px; line-height: 21px; letter-spacing: 1%; text-align: left; text-align: center; font-weight: bold;">
                  MerriTrade</div>
                <div style="width: 100%; display: inline-block; text-align: center; margin-top: 15px;">
                  <div class="div-13" style="display: inline-block;">
                    <div class="div-14"
                      style=" position: relative; min-width: 20px; min-height: 20px; max-width: 16px; width: 16px; float: left;">
                      <picture>
                        <source srcset="
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?format=webp&width=100   100w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?format=webp&width=200   200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?format=webp&width=400   400w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?format=webp&width=800   800w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?format=webp&width=1200 1200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?format=webp&width=1600 1600w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?format=webp&width=2000 2000w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2
                      " type="image/webp">
                        <img loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2" srcset="
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?width=100   100w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?width=200   200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?width=400   400w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?width=800   800w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?width=1200 1200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?width=1600 1600w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2?width=2000 2000w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F53069203cb524793843722736c0152e2
                      " class="image"
                          style="object-fit: cover; object-position: center; position: absolute; height: 100%; width: 100%; top: 0; left: 0;">
                      </picture>
                      <div class="builder-image-sizer image-sizer-3"
                        style="width: 100%; padding-top: 100%; pointer-events: none; font-size: 0;"></div>
                    </div>
                    <div class="div-16"
                      style=" position: relative; min-width: 20px; min-height: 20px; max-width: 16px; width: 16px; margin-left: 8px; float: left;">
                      <picture>
                        <source srcset="
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?format=webp&width=100   100w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?format=webp&width=200   200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?format=webp&width=400   400w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?format=webp&width=800   800w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?format=webp&width=1200 1200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?format=webp&width=1600 1600w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?format=webp&width=2000 2000w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc
                      " type="image/webp">
                        <img loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc" srcset="
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?width=100   100w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?width=200   200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?width=400   400w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?width=800   800w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?width=1200 1200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?width=1600 1600w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc?width=2000 2000w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2Fec023310a77346b29c087214de62becc
                      " class="image"
                          style="object-fit: cover; object-position: center; position: absolute; height: 100%; width: 100%; top: 0; left: 0;">
                      </picture>
                      <div class="builder-image-sizer image-sizer-5"
                        style="width: 100%; padding-top: 100%; pointer-events: none; font-size: 0;"></div>
                    </div>
                    <div class="div-15"
                      style=" position: relative; min-width: 20px; min-height: 20px; max-width: 16px; width: 16px; margin-left: 8px; float: left;">
                      <picture>
                        <source srcset="
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?format=webp&width=100   100w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?format=webp&width=200   200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?format=webp&width=400   400w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?format=webp&width=800   800w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?format=webp&width=1200 1200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?format=webp&width=1600 1600w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?format=webp&width=2000 2000w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34
                      " type="image/webp">
                        <img loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34" srcset="
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?width=100   100w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?width=200   200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?width=400   400w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?width=800   800w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?width=1200 1200w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?width=1600 1600w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34?width=2000 2000w,
                        https://cdn.builder.io/api/v1/image/assets%2FTEMP%2F0992868b1a47487eb61d4b319756ca34
                      " class="image"
                          style="object-fit: cover; object-position: center; position: absolute; height: 100%; width: 100%; top: 0; left: 0;">
                      </picture>
                      <div class="builder-image-sizer image-sizer-4"
                        style="width: 100%; padding-top: 100%; pointer-events: none; font-size: 0;"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>

    </html>
`;
    if (mail) {
      mail.html = mailTemplate;
    }
    try {
      const transport = await SendGrid.send(mail);

      return transport;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendVerificationEmail(email: string) {
    try {
      const payload: EmailVerificationTokenPayload = { email };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
        )}s`,
      });

      const urlConfirmation = `http://localhost:8000/mail/verify-email?token=${token}`;
      const text = `Welcome to the application. To confirm the email address, click here: ${urlConfirmation}`;
      const mail: SendGrid.MailDataRequired = {
        from: 'knabao7a7@gmail.com',
        to: email,
        subject: 'Confirm your email address',
        text: text,
      };

      const transport = await SendGrid.send(mail);
      return transport;
    } catch (error) {
      this.logger.debug(error);
      throw new BadRequestException(`${error}`);
    }
  }

  async decodeEmailToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      this.logger.debug({ payload });

      if (payload.email) {
        return payload.email;
      }

      throw new BadRequestException();
    } catch (error) {
      throw new BadRequestException(`${error}`);
    }
  }

  async confirmEmail(email: string) {
    try {
      const user = await this.userService.getUserByOption({
        where: {
          email,
        },
      });

      if (user.isEmailConfirmed) {
        throw new BadRequestException('Email already confirmed');
      }
      const updatedUser = await this.userService.updateUserByOption(user.id, {
        isEmailConfirmed: true,
      });

      return updatedUser;
    } catch (error) {
      throw new BadRequestException(`${error}`);
    }
  }

  async resendVericationEmail(userId: string) {
    try {
      const user = await this.userService.getUserByOption({
        where: {
          id: userId,
        },
      });

      if (user.isEmailConfirmed) {
        throw new BadRequestException('Email already confirmed');
      }
      return await this.sendVerificationEmail(user.email);
    } catch (error) {
      throw new BadRequestException(`${error}`);
    }
  }
}
