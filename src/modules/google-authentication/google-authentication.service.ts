import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';
import { AuthenService } from '../authen/authen.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class GoogleAuthenticationService {
  oauthClient = new google.auth.OAuth2();
  constructor(
    private readonly configService: ConfigService,
    private userService: UserService,
    private authenService: AuthenService,
  ) {
    const clientID = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(token: string) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token);

    const { email } = tokenInfo;

    try {
      const user = await this.userService.getUserByOption({
        where: {
          email,
        },
      });

      if (user) return await this.handleLoginGoogle(user);
      return await this.registerUser(token, email);
    } catch (error) {
      throw new HttpException(`Error  ${error}`, HttpStatus.BAD_GATEWAY);
    }
  }

  async registerUser(token: string, email: string) {
    const userData = await this.getUserData(token);
    const name = userData.name;
    const user = await this.userService.createWithGoogle(email, name);

    return await this.handleLoginGoogle(user);
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;
    this.oauthClient.setCredentials({ access_token: token });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }

  async handleLoginGoogle(user: User) {
    try {
      if (!user.isRegisteredWithGoogle) {
        throw new HttpException(
          "User isn't registered with google",
          HttpStatus.BAD_GATEWAY,
        );
      }

      const { accessToken, refreshToken } = this.authenService.getAllToken(
        user.id,
      );

      await this.userService.setRefreshToken(user.id, refreshToken);

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      console.log('error in generate token', error);
    }
  }
}
