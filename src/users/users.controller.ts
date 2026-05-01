import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @Roles(UserRole.ADMIN, UserRole.SOCIAL_WORKER, UserRole.LAW_ENFORCEMENT)
  getProfile(@CurrentUser() currentUser: any) {
    return this.usersService.findById(currentUser.userId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id/role')
  @Roles(UserRole.ADMIN)
  updateUserRole(@Param('id') id: string, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.usersService.updateUserRole(id, updateUserRoleDto.role);
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN)
  updateUserStatus(@Param('id') id: string, @Body() updateStatusDto: { isActive: boolean }) {
    return this.usersService.updateUserStatus(id, updateStatusDto.isActive);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
