import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { PerpetratorsService } from './perpetrators.service';
import { CreatePerpetratorDto, UpdatePerpetratorDto } from './dto/perpetrator.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('perpetrators')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PerpetratorsController {
  constructor(private perpetratorsService: PerpetratorsService) {}

  // View perpetrator database - Admin, Social Worker, Law Enforcement
  @Roles(UserRole.ADMIN, UserRole.SOCIAL_WORKER, UserRole.LAW_ENFORCEMENT)
  @Get()
  async findAll() {
    return this.perpetratorsService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.SOCIAL_WORKER, UserRole.LAW_ENFORCEMENT)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.perpetratorsService.findById(id);
  }

  // Create perpetrator records - Admin, Social Worker, Law Enforcement
  @Roles(UserRole.ADMIN, UserRole.SOCIAL_WORKER, UserRole.LAW_ENFORCEMENT)
  @Post()
  async create(@Body() createPerpetratorDto: CreatePerpetratorDto) {
    return this.perpetratorsService.create(createPerpetratorDto);
  }

  // Update perpetrator records - Admin, Social Worker, Law Enforcement
  @Roles(UserRole.ADMIN, UserRole.SOCIAL_WORKER, UserRole.LAW_ENFORCEMENT)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePerpetratorDto: UpdatePerpetratorDto) {
    return this.perpetratorsService.update(id, updatePerpetratorDto);
  }

  // Admin-only operations
  @Roles(UserRole.ADMIN)
  @Get('search/:query')
  async searchPerpetrators(@Param('query') query: string) {
    return this.perpetratorsService.search(query);
  }
}
