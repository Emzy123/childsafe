import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: (user as any)._id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (user as any)._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async registerWithRole(createAdminUserDto: CreateAdminUserDto) {
    const existingUser = await this.usersService.findByEmail(createAdminUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminUserDto.password, 10);
    const user = await this.usersService.create({
      fullName: createAdminUserDto.fullName,
      email: createAdminUserDto.email,
      passwordHash: hashedPassword,
      role: createAdminUserDto.role,
    });

    const payload = { sub: (user as any)._id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (user as any)._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
