import { Controller, Post, UseGuards, Req, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

//import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';

import { Request } from 'express';

import { SignUpDto } from './dto/sign-up.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req: Request): Promise<SignInResponseDto> {
    const user = req.user as User;
    return this.authService.login(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signup')
  async signup(@Body() signupDto: SignUpDto) {
    return await this.authService.signup(signupDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async getProfile(@CurrentUser() user: User): Promise<User | null> {
    console.log(user);

    return await this.authService.getUserProfile(user.id);
  }
}
