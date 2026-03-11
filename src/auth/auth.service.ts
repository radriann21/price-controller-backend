import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginData: LoginDto) {
    try {
      const user = await this.usersService.findOne(loginData.username);

      if (!user) {
        throw new Error('User not found');
      }

      const payload = { username: user.username, sub: user.id };
      const token = await this.jwtService.signAsync(payload);

      return { user, token };
    } catch (error) {
      this.logger.error('Error logging in', error);
      throw error;
    }
  }
}
