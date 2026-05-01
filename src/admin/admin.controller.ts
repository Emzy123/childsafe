import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateAdminUserDto } from '../auth/dto/create-admin-user.dto';
import { SystemConfigDto } from './dto/system-config.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Dashboard Overview
  @Get('dashboard')
  async getDashboardOverview() {
    return this.adminService.getDashboardOverview();
  }

  // User Management
  @Get('users')
  async getAllUsers(@Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string) {
    return this.adminService.getAllUsers(page, limit, search);
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Post('users')
  async createUser(@Body() createUserDto: CreateAdminUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Put('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.adminService.updateUserRole(id, role);
  }

  @Put('users/:id/status')
  async updateUserStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.adminService.updateUserStatus(id, isActive);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // Case Management
  @Get('incidents')
  async getAllIncidents(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string, @Query('assignee') assignee?: string) {
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    return this.adminService.getAllIncidents(pageNum, limitNum, status, assignee);
  }

  @Get('incidents/:id')
  async getIncidentById(@Param('id') id: string) {
    return this.adminService.getIncidentById(id);
  }

  @Put('incidents/:id/assign')
  async reassignIncident(@Param('id') id: string, @Body('assigneeId') assigneeId: string) {
    return this.adminService.reassignIncident(id, assigneeId);
  }

  @Delete('incidents/:id')
  async deleteIncident(@Param('id') id: string) {
    return this.adminService.deleteIncident(id);
  }

  // Statistics and Analytics
  @Get('statistics/overview')
  async getStatisticsOverview(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.adminService.getStatisticsOverview(startDate, endDate);
  }

  @Get('statistics/cases-by-status')
  async getCasesByStatus(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.adminService.getCasesByStatus(startDate, endDate);
  }

  @Get('statistics/cases-by-type')
  async getCasesByType(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.adminService.getCasesByType(startDate, endDate);
  }

  @Get('statistics/cases-by-location')
  async getCasesByLocation(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.adminService.getCasesByLocation(startDate, endDate);
  }

  @Get('statistics/user-performance')
  async getUserPerformance(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.adminService.getUserPerformance(startDate, endDate);
  }

  // Perpetrator Management
  @Get('perpetrators')
  async getAllPerpetrators(@Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string) {
    return this.adminService.getAllPerpetrators(page, limit, search);
  }

  @Get('perpetrators/:id')
  async getPerpetratorById(@Param('id') id: string) {
    return this.adminService.getPerpetratorById(id);
  }

  @Get('perpetrators/search/:query')
  async searchPerpetrators(@Param('query') query: string) {
    return this.adminService.searchPerpetrators(query);
  }

  // System Configuration
  @Get('system/config')
  async getSystemConfig() {
    return this.adminService.getSystemConfig();
  }

  @Put('system/config')
  async updateSystemConfig(@Body() configDto: SystemConfigDto) {
    return this.adminService.updateSystemConfig(configDto);
  }

  // Audit Logs
  @Get('audit-logs')
  async getAuditLogs(@Query('page') page?: number, @Query('limit') limit?: number, @Query('userId') userId?: string, @Query('action') action?: string) {
    return this.adminService.getAuditLogs(page, limit, userId, action);
  }

  // Data Export
  @Post('export/cases')
  async exportCases(@Body() exportOptions: { format: 'csv' | 'excel' | 'pdf', filters?: any }) {
    return this.adminService.exportCases(exportOptions);
  }

  @Post('export/users')
  async exportUsers(@Body() exportOptions: { format: 'csv' | 'excel' | 'pdf', filters?: any }) {
    return this.adminService.exportUsers(exportOptions);
  }

  @Post('export/statistics')
  async exportStatistics(@Body() exportOptions: { format: 'csv' | 'excel' | 'pdf', reportType: string, filters?: any }) {
    return this.adminService.exportStatistics(exportOptions);
  }

  // System Health
  @Get('system/health')
  async getSystemHealth() {
    return this.adminService.getSystemHealth();
  }

  // Notifications
  @Get('notifications')
  async getNotifications() {
    return this.adminService.getNotifications();
  }

  @Post('notifications')
  async createNotification(@Body() notificationDto: { title: string; message: string; type: 'info' | 'warning' | 'error'; recipients?: string[] }) {
    return this.adminService.createNotification(notificationDto);
  }
}
