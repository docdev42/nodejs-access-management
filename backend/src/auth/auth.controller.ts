import { Body, Controller, Post, Headers, UseGuards } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authservice.login(dto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Headers('authorization') authHeader: string) {
    return this.authservice.logout(authHeader.split(' ')[1]);
  }
}
