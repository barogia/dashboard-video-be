import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TokenPayload } from './interfaces/authen.interface';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/authen.dto';
import { MailService } from '../mail/mail.service';
@Injectable()
export class AuthenService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: MailService,
  ) {}

  private logger = new Logger(AuthenService.name);

  async register(registerInput: RegisterUserDto) {
    const hashed = await bcrypt.hash(registerInput.password, 10);
    try {
      const newUser = await this.userService.createUser({
        ...registerInput,
        password: hashed,
      });

      await this.emailService.sendVerificationEmail(newUser.email);
      newUser.password = undefined;

      return newUser;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Something went wrong, maybe this user is already exist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getAllToken(userId: string) {
    const payload: TokenPayload = { userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    // return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
    //   'JWT_EXPIRATION_TIME',
    // )}`;

    return { accessToken, refreshToken };
  }

  getAccessToken(userId: string) {
    try {
      const payload: TokenPayload = { userId };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      });
      return accessToken;
    } catch (error) {}
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.userService.getUserByOption({
        where: {
          email,
        },
      });

      await this.verifyPassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(` ${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyPassword(userPassword: string, hashedPass: string) {
    const isMatchPass = await bcrypt.compare(userPassword, hashedPass);
    if (!isMatchPass) {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  async getAllUser() {
    return await this.userService.getAllUser();
  }

  async deleteAllUser() {
    return await this.userService.deleteAll();
  }

  async removeRefreshToken(userId: string) {
    return await this.userService.removeRefreshToken(userId);
  }
}
