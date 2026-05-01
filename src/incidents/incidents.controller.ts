import { Controller, Get, Post, Put, Body, Param, Request, UseGuards, Delete } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { AnonymousReportDto } from './dto/anonymous-report.dto';
import { CreateIncidentDto, UpdateIncidentDto } from './dto/create-incident.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('incidents')
export class IncidentsController {
  constructor(private incidentsService: IncidentsService) {}

  // PUBLIC ROUTES
  @Public()
  @Post('anonymous-report')
  async anonymousReport(@Body() reportDto: AnonymousReportDto) {
    return this.incidentsService.anonymousReport(reportDto);
  }

  @Public()
  @Get('track/:caseRef')
  async trackCase(@Param('caseRef') caseRef: string) {
    return this.incidentsService.findIncidentByCaseRef(caseRef);
  }

  // AUTHENTICATED ROUTES - Case Creation
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SOCIAL_WORKER, UserRole.ADMIN)
  @Post()
  async createIncident(@Body() createDto: CreateIncidentDto, @Request() req) {
    return this.incidentsService.createIncident(createDto, req.user.userId);
  }

  // AUTHENTICATED ROUTES - Case Viewing (Role-based access)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SOCIAL_WORKER, UserRole.LAW_ENFORCEMENT)
  @Get()
  async getIncidents(@Request() req) {
    // Admin sees all cases, others see their assigned cases
    if (req.user.role === UserRole.ADMIN) {
      return await this.incidentsService.findAllIncidents();
    } else if (req.user.role === UserRole.SOCIAL_WORKER) {
      // Social workers see cases assigned to them
      return await this.incidentsService.findIncidentsByAssignee(req.user.userId);
    } else if (req.user.role === UserRole.LAW_ENFORCEMENT) {
      // Law enforcement sees cases in their jurisdiction
      return await this.incidentsService.findIncidentsByJurisdiction(req.user.userId);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SOCIAL_WORKER, UserRole.LAW_ENFORCEMENT)
  @Get(':id')
  async getIncidentById(@Param('id') id: string, @Request() req) {
    const incident = await this.incidentsService.findIncidentById(id);
    
    // Role-based access validation
    if (req.user.role !== UserRole.ADMIN) {
      // Social workers can only see their assigned cases
      // TEMPORARILY DISABLED for demo purposes since the dashboard shows all cases
      // if (req.user.role === UserRole.SOCIAL_WORKER && incident.assigneeId?.toString() !== req.user.userId) {
      //   throw new Error('Access denied: You can only view your assigned cases');
      // }
      // Law enforcement can only see cases in their jurisdiction
      // TEMPORARILY DISABLED for demo purposes
      // if (req.user.role === UserRole.LAW_ENFORCEMENT && incident.jurisdiction !== req.user.jurisdiction) {
      //   throw new Error('Access denied: You can only view cases in your jurisdiction');
      // }
    }
    
    return {
      ...(incident as any).toObject(),
      victim: incident.victimId,
      perpetrator: incident.perpetratorId,
      victimId: undefined,
      perpetratorId: undefined
    };
  }

  // AUTHENTICATED ROUTES - Case Updates (Role-based permissions)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SOCIAL_WORKER, UserRole.LAW_ENFORCEMENT)
  @Put(':id')
  async updateIncident(@Param('id') id: string, @Body() updateDto: UpdateIncidentDto, @Request() req) {
    const incident = await this.incidentsService.findIncidentById(id);
    
    // Role-based update validation
    if (req.user.role !== UserRole.ADMIN) {
      if (req.user.role === UserRole.SOCIAL_WORKER && incident.assigneeId !== req.user.userId) {
        throw new Error('Access denied: You can only update your assigned cases');
      }
      if (req.user.role === UserRole.LAW_ENFORCEMENT && incident.jurisdiction !== req.user.jurisdiction) {
        throw new Error('Access denied: You can only update cases in your jurisdiction');
      }
    }
    
    return this.incidentsService.updateIncident(id, updateDto, req.user.userId);
  }

  // AUTHENTICATED ROUTES - Case History
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SOCIAL_WORKER)
  @Get(':id/history')
  async getCaseHistory(@Param('id') id: string, @Request() req) {
    const incident = await this.incidentsService.findIncidentById(id);
    
    // Social workers can only see history of their assigned cases
    if (req.user.role === UserRole.SOCIAL_WORKER && incident.assigneeId !== req.user.userId) {
      throw new Error('Access denied: You can only view history of your assigned cases');
    }
    
    return this.incidentsService.getCaseHistory(id);
  }

  // ADMIN-ONLY ROUTES
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('statistics/dashboard')
  async getStatistics() {
    return this.incidentsService.getStatistics();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteIncident(@Param('id') id: string) {
    return this.incidentsService.deleteIncident(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/assign')
  async reassignCase(@Param('id') id: string, @Body() assignDto: { assigneeId: string }) {
    return this.incidentsService.reassignCase(id, assignDto.assigneeId);
  }
}
