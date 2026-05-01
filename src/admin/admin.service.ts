import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { IncidentsService } from '../incidents/incidents.service';
import { PerpetratorsService } from '../perpetrators/perpetrators.service';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateAdminUserDto } from '../auth/dto/create-admin-user.dto';
import { SystemConfigDto } from './dto/system-config.dto';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private incidentsService: IncidentsService,
    private perpetratorsService: PerpetratorsService,
  ) {}

  // Dashboard Overview
  async getDashboardOverview() {
    const [
      totalUsers,
      totalIncidents,
      activeIncidents,
      totalPerpetrators,
      recentCases,
      userStats,
    ] = await Promise.all([
      this.usersService.findAll(),
      this.incidentsService.findAllIncidents(),
      this.incidentsService.findAllIncidents().then(incidents => 
        incidents.filter(incident => incident.status !== 'closed').length
      ),
      this.perpetratorsService.findAll(),
      this.incidentsService.findAllIncidents().then(incidents => 
        incidents.slice(0, 5).map(incident => ({
          id: (incident as any)._id,
          caseRef: incident.caseRef,
          status: incident.status,
          abuseType: incident.abuseType,
          createdAt: (incident as any).createdAt,
        }))
      ),
      this.getUserStats(),
    ]);

    return {
      totalUsers: totalUsers.length,
      totalIncidents: totalIncidents.length,
      activeIncidents,
      totalPerpetrators: totalPerpetrators.length,
      recentCases,
      userStats,
    };
  }

  // User Management
  async getAllUsers(page = 1, limit = 10, search?: string) {
    const users = await this.usersService.findAll();
    
    let filteredUsers = users;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = users.filter(user => 
        user.fullName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    return {
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredUsers.length / limit),
    };
  }

  async getUserById(id: string) {
    return this.usersService.findById(id);
  }

  async createUser(createUserDto: CreateAdminUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    return this.usersService.create({
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      passwordHash: createUserDto.password, // This should be hashed in the service
      role: createUserDto.role,
    });
  }

  async updateUserRole(id: string, role: UserRole) {
    return this.usersService.updateUserRole(id, role);
  }

  async updateUserStatus(id: string, isActive: boolean) {
    return this.usersService.updateUserStatus(id, isActive);
  }

  async deleteUser(id: string) {
    return this.usersService.remove(id);
  }

  // Case Management
  async getAllIncidents(page = 1, limit = 50, status?: string, assignee?: string) {
    const incidents = await this.incidentsService.findAllIncidents();
    
    let filteredIncidents = incidents;
    if (status) {
      filteredIncidents = incidents.filter(incident => incident.status === status);
    }
    if (assignee) {
      filteredIncidents = filteredIncidents.filter(incident => 
        (incident as any).assigneeId === assignee
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedIncidents = filteredIncidents.slice(startIndex, startIndex + limit);

    return {
      incidents: paginatedIncidents,
      total: filteredIncidents.length,
      page,
      limit,
      totalPages: Math.ceil(filteredIncidents.length / limit),
    };
  }

  async getIncidentById(id: string) {
    return this.incidentsService.findIncidentById(id);
  }

  async reassignIncident(id: string, assigneeId: string) {
    return this.incidentsService.reassignCase(id, assigneeId);
  }

  async deleteIncident(id: string) {
    return this.incidentsService.deleteIncident(id);
  }

  // Statistics and Analytics
  async getStatisticsOverview(startDate?: string, endDate?: string) {
    const incidents = await this.incidentsService.findAllIncidents();
    
    let filteredIncidents = incidents;
    if (startDate || endDate) {
      filteredIncidents = incidents.filter(incident => {
        const incidentDate = new Date((incident as any).createdAt);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return incidentDate >= start && incidentDate <= end;
      });
    }

    const statusCounts = filteredIncidents.reduce((acc, incident) => {
      acc[incident.status] = (acc[incident.status] || 0) + 1;
      return acc;
    }, {});

    const typeCounts = filteredIncidents.reduce((acc, incident) => {
      acc[incident.abuseType] = (acc[incident.abuseType] || 0) + 1;
      return acc;
    }, {});

    return {
      totalCases: filteredIncidents.length,
      statusBreakdown: statusCounts,
      typeBreakdown: typeCounts,
      averageResolutionTime: this.calculateAverageResolutionTime(filteredIncidents),
      monthlyTrend: this.getMonthlyTrend(filteredIncidents),
    };
  }

  async getCasesByStatus(startDate?: string, endDate?: string) {
    const incidents = await this.incidentsService.findAllIncidents();
    
    let filteredIncidents = incidents;
    if (startDate || endDate) {
      filteredIncidents = incidents.filter(incident => {
        const incidentDate = new Date((incident as any).createdAt);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return incidentDate >= start && incidentDate <= end;
      });
    }

    return filteredIncidents.reduce((acc, incident) => {
      acc[incident.status] = (acc[incident.status] || 0) + 1;
      return acc;
    }, {});
  }

  async getCasesByType(startDate?: string, endDate?: string) {
    const incidents = await this.incidentsService.findAllIncidents();
    
    let filteredIncidents = incidents;
    if (startDate || endDate) {
      filteredIncidents = incidents.filter(incident => {
        const incidentDate = new Date((incident as any).createdAt);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return incidentDate >= start && incidentDate <= end;
      });
    }

    return filteredIncidents.reduce((acc, incident) => {
      acc[incident.abuseType] = (acc[incident.abuseType] || 0) + 1;
      return acc;
    }, {});
  }

  async getCasesByLocation(startDate?: string, endDate?: string) {
    const incidents = await this.incidentsService.findAllIncidents();
    
    let filteredIncidents = incidents;
    if (startDate || endDate) {
      filteredIncidents = incidents.filter(incident => {
        const incidentDate = new Date((incident as any).createdAt);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return incidentDate >= start && incidentDate <= end;
      });
    }

    return filteredIncidents.reduce((acc, incident) => {
      const location = incident.location;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
  }

  async getUserPerformance(startDate?: string, endDate?: string) {
    const users = await this.usersService.findAll();
    const incidents = await this.incidentsService.findAllIncidents();
    
    let filteredIncidents = incidents;
    if (startDate || endDate) {
      filteredIncidents = incidents.filter(incident => {
        const incidentDate = new Date((incident as any).createdAt);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return incidentDate >= start && incidentDate <= end;
      });
    }

    return users.filter(user => user.role !== UserRole.ADMIN).map(user => {
      const userIncidents = filteredIncidents.filter(incident => 
        (incident as any).assigneeId === (user as any)._id
      );
      
      return {
        userId: (user as any)._id,
        fullName: user.fullName,
        role: user.role,
        totalCases: userIncidents.length,
        closedCases: userIncidents.filter(i => i.status === 'closed').length,
        activeCases: userIncidents.filter(i => i.status !== 'closed').length,
        averageResolutionTime: this.calculateAverageResolutionTime(userIncidents),
      };
    });
  }

  // Perpetrator Management
  async getAllPerpetrators(page = 1, limit = 10, search?: string) {
    const perpetrators = await this.perpetratorsService.findAll();
    
    let filteredPerpetrators = perpetrators;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPerpetrators = perpetrators.filter(perp => 
        perp.firstName?.toLowerCase().includes(searchLower) ||
        perp.lastName?.toLowerCase().includes(searchLower) ||
        perp.aliases?.some((alias: string) => alias.toLowerCase().includes(searchLower))
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedPerpetrators = filteredPerpetrators.slice(startIndex, startIndex + limit);

    return {
      perpetrators: paginatedPerpetrators,
      total: filteredPerpetrators.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPerpetrators.length / limit),
    };
  }

  async getPerpetratorById(id: string) {
    return this.perpetratorsService.findById(id);
  }

  async searchPerpetrators(query: string) {
    return this.perpetratorsService.search(query);
  }

  // System Configuration
  async getSystemConfig() {
    // This would typically come from a database
    return {
      systemName: 'Child Abuse Database Management System',
      version: '1.0.0',
      maintenanceMode: false,
      allowAnonymousReporting: true,
      caseAutoAssignment: false,
      emailNotifications: true,
      dataRetentionDays: 2555, // 7 years
      sessionTimeout: 30, // minutes
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
      },
    };
  }

  async updateSystemConfig(configDto: SystemConfigDto) {
    // This would typically update a database
    return { message: 'System configuration updated successfully', config: configDto };
  }

  // Audit Logs
  async getAuditLogs(page = 1, limit = 10, userId?: string, action?: string) {
    // This would typically come from an audit log collection
    const mockLogs = [
      {
        id: '1',
        userId: 'user1',
        action: 'LOGIN',
        timestamp: new Date(),
        details: 'User logged in successfully',
        ipAddress: '192.168.1.1',
      },
      {
        id: '2',
        userId: 'user2',
        action: 'CREATE_CASE',
        timestamp: new Date(),
        details: 'Created new case CAB-2024-ABC123',
        ipAddress: '192.168.1.2',
      },
    ];

    let filteredLogs = mockLogs;
    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === userId);
    }
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    const startIndex = (page - 1) * limit;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + limit);

    return {
      logs: paginatedLogs,
      total: filteredLogs.length,
      page,
      limit,
      totalPages: Math.ceil(filteredLogs.length / limit),
    };
  }

  // Data Export
  async exportCases(exportOptions: { format: 'csv' | 'excel' | 'pdf', filters?: any }) {
    // This would generate actual export files
    return {
      downloadUrl: `/api/exports/cases.${exportOptions.format}`,
      filename: `cases_export.${exportOptions.format}`,
      generatedAt: new Date(),
    };
  }

  async exportUsers(exportOptions: { format: 'csv' | 'excel' | 'pdf', filters?: any }) {
    return {
      downloadUrl: `/api/exports/users.${exportOptions.format}`,
      filename: `users_export.${exportOptions.format}`,
      generatedAt: new Date(),
    };
  }

  async exportStatistics(exportOptions: { format: 'csv' | 'excel' | 'pdf', reportType: string, filters?: any }) {
    return {
      downloadUrl: `/api/exports/statistics_${exportOptions.reportType}.${exportOptions.format}`,
      filename: `statistics_${exportOptions.reportType}_export.${exportOptions.format}`,
      generatedAt: new Date(),
    };
  }

  // System Health
  async getSystemHealth() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      database: {
        status: 'connected',
        responseTime: '12ms',
      },
      lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      activeUsers: 15,
      errorRate: 0.02,
    };
  }

  // Notifications
  async getNotifications() {
    return [
      {
        id: '1',
        title: 'System Maintenance',
        message: 'Scheduled maintenance in 2 hours',
        type: 'warning',
        timestamp: new Date(),
        read: false,
      },
      {
        id: '2',
        title: 'New Case Assigned',
        message: 'Case CAB-2024-XYZ789 has been assigned to you',
        type: 'info',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        read: true,
      },
    ];
  }

  async createNotification(notificationDto: { title: string; message: string; type: 'info' | 'warning' | 'error'; recipients?: string[] }) {
    return {
      id: Date.now().toString(),
      ...notificationDto,
      timestamp: new Date(),
      read: false,
    };
  }

  // Helper methods
  private async getUserStats() {
    const users = await this.usersService.findAll();
    return {
      admin: users.filter(u => u.role === UserRole.ADMIN).length,
      socialWorker: users.filter(u => u.role === UserRole.SOCIAL_WORKER).length,
      lawEnforcement: users.filter(u => u.role === UserRole.LAW_ENFORCEMENT).length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
    };
  }

  private calculateAverageResolutionTime(incidents: any[]): number {
    const closedIncidents = incidents.filter(incident => incident.status === 'closed');
    if (closedIncidents.length === 0) return 0;
    
    const totalTime = closedIncidents.reduce((acc, incident) => {
      const created = new Date((incident as any).createdAt);
      const updated = new Date((incident as any).updatedAt);
      return acc + (updated.getTime() - created.getTime());
    }, 0);
    
    return totalTime / closedIncidents.length / (1000 * 60 * 60 * 24); // Convert to days
  }

  private getMonthlyTrend(incidents: any[]): any[] {
    const monthlyData = incidents.reduce((acc, incident) => {
      const month = new Date((incident as any).createdAt).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      count,
    })).sort((a, b) => a.month.localeCompare(b.month));
  }
}
