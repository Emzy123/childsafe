import { Controller, Get, Post, Put, Body, Param, Request, UseGuards } from '@nestjs/common';
import { SocialWorkerService } from './social-worker.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('social-worker')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SOCIAL_WORKER)
export class SocialWorkerController {
  constructor(private socialWorkerService: SocialWorkerService) {}

  // Dashboard Overview
  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.socialWorkerService.getDashboard(req.user.userId);
  }

  // Case Management
  @Get('cases')
  async getMyCases(@Request() req) {
    return this.socialWorkerService.getMyCases(req.user.userId);
  }

  @Get('cases/:id')
  async getCaseById(@Param('id') id: string, @Request() req) {
    return this.socialWorkerService.getCaseById(id, req.user.userId);
  }

  @Put('cases/:id/status')
  async updateCaseStatus(
    @Param('id') id: string,
    @Body() updateData: { status: string; notes?: string },
    @Request() req
  ) {
    return this.socialWorkerService.updateCaseStatus(id, updateData, req.user.userId);
  }

  @Post('cases/:id/notes')
  async addCaseNote(
    @Param('id') id: string,
    @Body() noteData: { content: string; type: string },
    @Request() req
  ) {
    return this.socialWorkerService.addCaseNote(id, noteData, req.user.userId);
  }

  @Get('cases/:id/notes')
  async getCaseNotes(@Param('id') id: string, @Request() req) {
    return this.socialWorkerService.getCaseNotes(id, req.user.userId);
  }

  // Victim Management
  @Get('victims')
  async getMyVictims(@Request() req) {
    return this.socialWorkerService.getMyVictims(req.user.userId);
  }

  @Get('victims/:id')
  async getVictimById(@Param('id') id: string, @Request() req) {
    return this.socialWorkerService.getVictimById(id, req.user.userId);
  }

  @Put('victims/:id')
  async updateVictim(
    @Param('id') id: string,
    @Body() updateData: any,
    @Request() req
  ) {
    return this.socialWorkerService.updateVictim(id, updateData, req.user.userId);
  }

  // Reporting and Documentation
  @Get('reports')
  async getMyReports(@Request() req) {
    return this.socialWorkerService.getMyReports(req.user.userId);
  }

  @Post('reports')
  async createReport(@Body() reportData: any, @Request() req) {
    return this.socialWorkerService.createReport(reportData, req.user.userId);
  }

  @Get('reports/:id')
  async getReportById(@Param('id') id: string, @Request() req) {
    return this.socialWorkerService.getReportById(id, req.user.userId);
  }

  // Statistics and Performance
  @Get('statistics')
  async getMyStatistics(@Request() req) {
    return this.socialWorkerService.getMyStatistics(req.user.userId);
  }

  @Get('performance')
  async getMyPerformance(@Request() req) {
    return this.socialWorkerService.getMyPerformance(req.user.userId);
  }

  // Referrals and Resources
  @Get('referrals')
  async getMyReferrals(@Request() req) {
    return this.socialWorkerService.getMyReferrals(req.user.userId);
  }

  @Post('referrals')
  async createReferral(@Body() referralData: any, @Request() req) {
    return this.socialWorkerService.createReferral(referralData, req.user.userId);
  }

  @Get('resources')
  async getResources() {
    return this.socialWorkerService.getResources();
  }

  // Appointments and Schedule
  @Get('appointments')
  async getMyAppointments(@Request() req) {
    return this.socialWorkerService.getMyAppointments(req.user.userId);
  }

  @Post('appointments')
  async createAppointment(@Body() appointmentData: any, @Request() req) {
    return this.socialWorkerService.createAppointment(appointmentData, req.user.userId);
  }

  @Put('appointments/:id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() updateData: any,
    @Request() req
  ) {
    return this.socialWorkerService.updateAppointment(id, updateData, req.user.userId);
  }
}
