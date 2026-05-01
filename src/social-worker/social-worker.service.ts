import { Injectable } from '@nestjs/common';
import { IncidentsService } from '../incidents/incidents.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SocialWorkerService {
  constructor(
    private incidentsService: IncidentsService,
    private usersService: UsersService,
  ) {}

  // Dashboard Overview
  async getDashboard(userId: string) {
    // Get all cases for social workers to monitor (similar to law enforcement)
    const allCases = await this.incidentsService.findAllIncidents();
    const myCases = allCases; // For now, show all cases like law enforcement dashboard
    
    const totalCases = myCases.length;
    const activeCases = myCases.filter(c => c.status !== 'closed').length;
    const closedCases = myCases.filter(c => c.status === 'closed').length;
    const newCases = myCases.filter(c => c.status === 'reported').length;
    const underInvestigation = myCases.filter(c => c.status === 'under_investigation').length;
    const withAgency = myCases.filter(c => c.status === 'with_agency').length;

    const recentCases = myCases
      .sort((a, b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime())
      .slice(0, 5)
      .map(incident => ({
        id: (incident as any)._id,
        caseRef: incident.caseRef,
        status: incident.status,
        abuseType: incident.abuseType,
        createdAt: (incident as any).createdAt,
        incidentDate: incident.incidentDate,
        location: incident.location
      }));

    return {
      totalCases,
      activeCases,
      closedCases,
      newCases,
      underInvestigation,
      withAgency,
      recentCases,
      caseStats: {
        reported: newCases,
        under_investigation: underInvestigation,
        with_agency: withAgency,
        closed: closedCases
      }
    };
  }

  // Case Management
  async getMyCases(userId: string) {
    // Get all cases for social workers to monitor (similar to law enforcement)
    const allCases = await this.incidentsService.findAllIncidents();
    return allCases.map(incident => ({
      id: (incident as any)._id,
      caseRef: incident.caseRef,
      status: incident.status,
      abuseType: incident.abuseType,
      incidentDate: incident.incidentDate,
      location: incident.location,
      createdAt: (incident as any).createdAt,
      updatedAt: (incident as any).updatedAt,
      victim: incident.victimId,
      perpetrator: incident.perpetratorId
    }));
  }

  async getCaseById(id: string, userId: string) {
    const incident = await this.incidentsService.findIncidentById(id);
    if (!incident || incident.assigneeId !== userId) {
      throw new Error('Case not found or access denied');
    }
    return incident;
  }

  async updateCaseStatus(id: string, updateData: { status: string; notes?: string }, userId: string) {
    const incident = await this.incidentsService.findIncidentById(id);
    if (!incident || incident.assigneeId !== userId) {
      throw new Error('Case not found or access denied');
    }
    
    return this.incidentsService.updateIncident(id, {
      status: updateData.status,
      ...(updateData.notes && { notes: updateData.notes })
    }, userId);
  }

  async addCaseNote(id: string, noteData: { content: string; type: string }, userId: string) {
    const incident = await this.incidentsService.findIncidentById(id);
    if (!incident || incident.assigneeId !== userId) {
      throw new Error('Case not found or access denied');
    }
    
    // Create a case update note
    const caseUpdate = {
      incidentId: id,
      type: 'note',
      description: noteData.content,
      updatedBy: userId,
      updatedAt: new Date(),
      previousStatus: incident.status,
      newStatus: incident.status
    };
    
    return this.incidentsService.addCaseUpdate(caseUpdate);
  }

  async getCaseNotes(id: string, userId: string) {
    const incident = await this.incidentsService.findIncidentById(id);
    if (!incident || incident.assigneeId !== userId) {
      throw new Error('Case not found or access denied');
    }
    
    // Fetch case updates for this incident
    return this.incidentsService.getCaseUpdates(id);
  }

  // Victim Management
  async getMyVictims(userId: string) {
    // Get all cases for social workers to monitor
    const allCases = await this.incidentsService.findAllIncidents();
    const victims = allCases
      .filter(case_ => case_.victimId)
      .map(case_ => case_.victimId);
    return victims;
  }

  async getVictimById(id: string, userId: string) {
    // Verify access through assigned cases
    const cases = await this.incidentsService.findIncidentsByAssignee(userId);
    const hasAccess = cases.some(case_ => 
      case_.victimId && (case_.victimId as any)._id.toString() === id
    );
    
    if (!hasAccess) {
      throw new Error('Victim not found or access denied');
    }
    
    // Return the victim from the case
    const caseWithVictim = cases.find(case_ => 
      case_.victimId && (case_.victimId as any)._id.toString() === id
    );
    
    return caseWithVictim.victimId;
  }

  async updateVictim(id: string, updateData: any, userId: string) {
    // Verify access through assigned cases
    const cases = await this.incidentsService.findIncidentsByAssignee(userId);
    const hasAccess = cases.some(case_ => 
      case_.victimId && (case_.victimId as any)._id.toString() === id
    );
    
    if (!hasAccess) {
      throw new Error('Victim not found or access denied');
    }
    
    // For now, return updated data - in a real implementation, this would update the victim in the database
    return { id, ...updateData, updatedAt: new Date() };
  }

  // Reporting and Documentation
  async getMyReports(userId: string) {
    // Get all cases for social workers to monitor
    const allCases = await this.incidentsService.findAllIncidents();
    
    // Generate reports based on all cases
    const reports = allCases.map(incident => ({
      id: `report_${(incident as any)._id}`,
      title: `Case Report - ${incident.caseRef}`,
      type: 'case',
      caseId: (incident as any)._id,
      caseRef: incident.caseRef,
      createdAt: (incident as any).updatedAt,
      status: incident.status === 'closed' ? 'completed' : 'in_progress'
    }));
    
    return reports;
  }

  async createReport(reportData: any, userId: string) {
    // Verify user has access to the case
    if (reportData.caseId) {
      const incident = await this.incidentsService.findIncidentById(reportData.caseId);
      if (!incident || incident.assigneeId !== userId) {
        throw new Error('Case not found or access denied');
      }
    }
    
    // Create a case update for the report
    const caseUpdate = {
      incidentId: reportData.caseId,
      type: 'report',
      description: reportData.title || 'New report created',
      updatedBy: userId,
      updatedAt: new Date(),
      previousStatus: reportData.previousStatus,
      newStatus: reportData.newStatus
    };
    
    return this.incidentsService.addCaseUpdate(caseUpdate);
  }

  async getReportById(id: string, userId: string) {
    // Extract incident ID from report ID
    const incidentId = id.replace('report_', '');
    const incident = await this.incidentsService.findIncidentById(incidentId);
    
    if (!incident || incident.assigneeId !== userId) {
      throw new Error('Report not found or access denied');
    }
    
    return {
      id,
      title: `Case Report - ${incident.caseRef}`,
      content: `Report for case ${incident.caseRef} - Status: ${incident.status}`,
      type: 'case',
      caseId: incidentId,
      caseRef: incident.caseRef,
      createdAt: (incident as any).createdAt,
      status: incident.status === 'closed' ? 'completed' : 'in_progress'
    };
  }

  // Statistics and Performance
  async getMyStatistics(userId: string) {
    const dashboard = await this.getDashboard(userId);
    return {
      casesByStatus: dashboard.caseStats,
      casesByType: await this.getCasesByType(userId),
      monthlyTrend: await this.getMonthlyTrend(userId)
    };
  }

  async getMyPerformance(userId: string) {
    const myCases = await this.incidentsService.findIncidentsByAssignee(userId);
    const closedCases = myCases.filter(c => c.status === 'closed');
    
    const averageResolutionTime = closedCases.length > 0 
      ? closedCases.reduce((total, case_) => {
          const created = new Date((case_ as any).createdAt);
          const updated = new Date((case_ as any).updatedAt);
          return total + (updated.getTime() - created.getTime());
        }, 0) / closedCases.length / (1000 * 60 * 60 * 24)
      : 0;

    return {
      totalCases: myCases.length,
      closedCases: closedCases.length,
      averageResolutionTime: Math.round(averageResolutionTime),
      activeCases: myCases.filter(c => c.status !== 'closed').length,
      completionRate: myCases.length > 0 ? Math.round((closedCases.length / myCases.length) * 100) : 0
    };
  }

  // Referrals and Resources
  async getMyReferrals(userId: string) {
    // Get all cases for social workers to monitor
    const allCases = await this.incidentsService.findAllIncidents();
    
    // Generate referrals based on cases that need external services
    const referrals = allCases
      .filter(incident => incident.status === 'with_agency')
      .map(incident => ({
        id: `referral_${(incident as any)._id}`,
        caseId: (incident as any)._id,
        caseRef: incident.caseRef,
        type: 'agency',
        to: 'Child Protection Agency',
        status: 'pending',
        createdAt: (incident as any).updatedAt,
        victim: incident.victimId
      }));
    
    return referrals;
  }

  async createReferral(referralData: any, userId: string) {
    // Verify user has access to the case
    if (referralData.caseId) {
      const incident = await this.incidentsService.findIncidentById(referralData.caseId);
      if (!incident || incident.assigneeId !== userId) {
        throw new Error('Case not found or access denied');
      }
    }
    
    // Create a case update for the referral
    const caseUpdate = {
      incidentId: referralData.caseId,
      type: 'referral',
      description: `Referral created: ${referralData.to}`,
      updatedBy: userId,
      updatedAt: new Date(),
      previousStatus: referralData.previousStatus,
      newStatus: referralData.newStatus || 'with_agency'
    };
    
    // Update incident status if needed
    if (referralData.newStatus) {
      await this.incidentsService.updateIncident(referralData.caseId, {
        status: referralData.newStatus
      }, userId);
    }
    
    return this.incidentsService.addCaseUpdate(caseUpdate);
  }

  async getResources() {
    // Return static resources for now - in a real implementation, these would come from a database
    return [
      {
        id: 'resource_1',
        name: 'Child Protection Services',
        type: 'service',
        contact: '123-456-7890',
        address: '123 Service St',
        description: 'Government child protection services'
      },
      {
        id: 'resource_2',
        name: 'Medical Support',
        type: 'medical',
        contact: '098-765-4321',
        address: '456 Medical Ave',
        description: 'Emergency medical services for abuse victims'
      },
      {
        id: 'resource_3',
        name: 'Legal Aid',
        type: 'legal',
        contact: '555-123-4567',
        address: '789 Legal Blvd',
        description: 'Free legal assistance for child abuse cases'
      }
    ];
  }

  // Appointments and Schedule
  async getMyAppointments(userId: string) {
    // Get all cases for social workers to monitor
    const allCases = await this.incidentsService.findAllIncidents();
    
    // Generate appointments based on active cases
    const appointments = allCases
      .filter(incident => incident.status !== 'closed')
      .slice(0, 5) // Limit to recent cases
      .map((incident, index) => ({
        id: `appointment_${(incident as any)._id}`,
        title: `Case Follow-up - ${incident.caseRef}`,
        date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000), // Schedule in coming days
        type: 'follow-up',
        status: 'scheduled',
        caseId: (incident as any)._id,
        caseRef: incident.caseRef,
        victim: incident.victimId
      }));
    
    return appointments;
  }

  async createAppointment(appointmentData: any, userId: string) {
    // Verify user has access to the case
    if (appointmentData.caseId) {
      const incident = await this.incidentsService.findIncidentById(appointmentData.caseId);
      if (!incident || incident.assigneeId !== userId) {
        throw new Error('Case not found or access denied');
      }
    }
    
    // Create a case update for the appointment
    const caseUpdate = {
      incidentId: appointmentData.caseId,
      type: 'appointment',
      description: `Appointment scheduled: ${appointmentData.title}`,
      updatedBy: userId,
      updatedAt: new Date(),
      previousStatus: appointmentData.previousStatus,
      newStatus: appointmentData.newStatus
    };
    
    return this.incidentsService.addCaseUpdate(caseUpdate);
  }

  async updateAppointment(id: string, updateData: any, userId: string) {
    // Extract case ID from appointment ID
    const caseId = id.replace('appointment_', '');
    const incident = await this.incidentsService.findIncidentById(caseId);
    
    if (!incident || incident.assigneeId !== userId) {
      throw new Error('Appointment not found or access denied');
    }
    
    // Create a case update for the appointment change
    const caseUpdate = {
      incidentId: caseId,
      type: 'appointment',
      description: `Appointment updated: ${updateData.title || 'Updated'}`,
      updatedBy: userId,
      updatedAt: new Date(),
      previousStatus: incident.status,
      newStatus: incident.status
    };
    
    return this.incidentsService.addCaseUpdate(caseUpdate);
  }

  // Helper methods
  private async getCasesByType(userId: string) {
    // Get all cases for social workers to monitor
    const allCases = await this.incidentsService.findAllIncidents();
    return allCases.reduce((acc, case_) => {
      acc[case_.abuseType] = (acc[case_.abuseType] || 0) + 1;
      return acc;
    }, {});
  }

  private async getMonthlyTrend(userId: string) {
    // Get all cases for social workers to monitor
    const allCases = await this.incidentsService.findAllIncidents();
    const monthlyData = allCases.reduce((acc, case_) => {
      const month = new Date((case_ as any).createdAt).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      count
    })).sort((a, b) => a.month.localeCompare(b.month));
  }
}
