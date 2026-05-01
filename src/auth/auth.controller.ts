import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('register-user')
  async registerUser(@Body() createAdminUserDto: CreateAdminUserDto) {
    return this.authService.registerWithRole(createAdminUserDto);
  }
}
