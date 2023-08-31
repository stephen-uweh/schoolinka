import {
  Body,
  Controller,
  Req,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '../core/success';
import { LoginInput } from '../dto/user.dto';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any, @Body() body: LoginInput) {
    return SuccessResponse(
      200,
      'User logged in successfully',
      { token: this.jwtService.sign(JSON.parse(JSON.stringify(req.user))) },
      null,
    );
  }

}
