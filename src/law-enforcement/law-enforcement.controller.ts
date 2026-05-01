import { Controller, Get, Post, Put, Body, Param, Request, UseGuards } from '@nestjs/common';
import { LawEnforcementService } from './law-enforcement.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('law-enforcement')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LAW_ENFORCEMENT)
export class LawEnforcementController {
  constructor(private lawEnforcementService: LawEnforcementService) {}

  // Dashboard Overview
  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.lawEnforcementService.getDashboard(req.user.userId);
  }

  // Case Investigation
  @Get('cases')
  async getMyCases(@Request() req) {
    return this.lawEnforcementService.getMyCases(req.user.userId);
  }

  @Get('cases/:id')
  async getCaseById(@Param('id') id: string, @Request() req) {
    return this.lawEnforcementService.getCaseById(id, req.user.userId);
  }

  @Put('cases/:id/status')
  async updateCaseStatus(
    @Param('id') id: string,
    @Body() updateData: { status: string; notes?: string },
    @Request() req
  ) {
    return this.lawEnforcementService.updateCaseStatus(id, updateData, req.user.userId);
  }

  @Post('cases/:id/evidence')
  async addEvidence(
    @Param('id') id: string,
    @Body() evidenceData: any,
    @Request() req
  ) {
    return this.lawEnforcementService.addEvidence(id, evidenceData, req.user.userId);
  }

  @Get('cases/:id/evidence')
  async getCaseEvidence(@Param('id') id: string, @Request() req) {
    return this.lawEnforcementService.getCaseEvidence(id, req.user.userId);
  }

  // Perpetrator Management
  @Get('perpetrators')
  async getPerpetrators(@Request() req) {
    return this.lawEnforcementService.getPerpetrators(req.user.userId);
  }

  @Get('perpetrators/:id')
  async getPerpetratorById(@Param('id') id: string, @Request() req) {
    return this.lawEnforcementService.getPerpetratorById(id, req.user.userId);
  }

  @Put('perpetrators/:id')
  async updatePerpetrator(
    @Param('id') id: string,
    @Body() updateData: any,
    @Request() req
  ) {
    return this.lawEnforcementService.updatePerpetrator(id, updateData, req.user.userId);
  }

  @Post('perpetrators')
  async createPerpetrator(@Body() perpetratorData: any, @Request() req) {
    return this.lawEnforcementService.createPerpetrator(perpetratorData, req.user.userId);
  }

  @Get('perpetrators/search/:query')
  async searchPerpetrators(@Param('query') query: string, @Request() req) {
    return this.lawEnforcementService.searchPerpetrators(query, req.user.userId);
  }

  // Investigation Tools
  @Get('investigations')
  async getMyInvestigations(@Request() req) {
    return this.lawEnforcementService.getMyInvestigations(req.user.userId);
  }

  @Post('investigations')
  async createInvestigation(@Body() investigationData: any, @Request() req) {
    return this.lawEnforcementService.createInvestigation(investigationData, req.user.userId);
  }

  @Get('investigations/:id')
  async getInvestigationById(@Param('id') id: string, @Request() req) {
    return this.lawEnforcementService.getInvestigationById(id, req.user.userId);
  }

  @Put('investigations/:id')
  async updateInvestigation(
    @Param('id') id: string,
    @Body() updateData: any,
    @Request() req
  ) {
    return this.lawEnforcementService.updateInvestigation(id, updateData, req.user.userId);
  }

  // Warrants and Legal Actions
  @Get('warrants')
  async getWarrants(@Request() req) {
    return this.lawEnforcementService.getWarrants(req.user.userId);
  }

  @Post('warrants')
  async createWarrant(@Body() warrantData: any, @Request() req) {
    return this.lawEnforcementService.createWarrant(warrantData, req.user.userId);
  }

  @Get('warrants/:id')
  async getWarrantById(@Param('id') id: string, @Request() req) {
    return this.lawEnforcementService.getWarrantById(id, req.user.userId);
  }

  // Reports and Documentation
  @Get('reports')
  async getMyReports(@Request() req) {
    return this.lawEnforcementService.getMyReports(req.user.userId);
  }

  @Post('reports')
  async createReport(@Body() reportData: any, @Request() req) {
    return this.lawEnforcementService.createReport(reportData, req.user.userId);
  }

  @Get('reports/:id')
  async getReportById(@Param('id') id: string, @Request() req) {
    return this.lawEnforcementService.getReportById(id, req.user.userId);
  }

  // Statistics and Analytics
  @Get('statistics')
  async getMyStatistics(@Request() req) {
    return this.lawEnforcementService.getMyStatistics(req.user.userId);
  }

  @Get('analytics')
  async getMyAnalytics(@Request() req) {
    return this.lawEnforcementService.getMyAnalytics(req.user.userId);
  }

  // Case Collaboration
  @Get('collaborations')
  async getMyCollaborations(@Request() req) {
    return this.lawEnforcementService.getMyCollaborations(req.user.userId);
  }

  @Post('collaborations')
  async createCollaboration(@Body() collaborationData: any, @Request() req) {
    return this.lawEnforcementService.createCollaboration(collaborationData, req.user.userId);
  }

  // Alerts and Notifications
  @Get('alerts')
  async getMyAlerts(@Request() req) {
    return this.lawEnforcementService.getMyAlerts(req.user.userId);
  }

  @Post('alerts')
  async createAlert(@Body() alertData: any, @Request() req) {
    return this.lawEnforcementService.createAlert(alertData, req.user.userId);
  }
}
