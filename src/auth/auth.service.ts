import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrorResponse } from '../core/errors';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { UserService } from '../user/user.service';

const cookieOptions: CookieOptions = {
  domain: process.env.DOMAIN, // <- Change to your client domain
  secure: false, // <- Should be true if !development
  sameSite: 'strict',
  httpOnly: true,
  path: '/',
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email:email });
    if (!user) ErrorResponse(404, 'No account exists for this user', null, null);
    const passwordValid = await this.userService.comparePassword(email, password)
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

}
