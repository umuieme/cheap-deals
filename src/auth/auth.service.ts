import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // const user = await this.userService.findUser(email);
    // const isPasswordMatch = await bcrypt.compare(password, user.password);

    // if (user && isPasswordMatch) {
    //   return user;
    // }
    // return null;

    const user = await this.userService.findUser(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email and password');
    }

    return { accessToken: this.jwtService.sign({ email: user.email }) };
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
