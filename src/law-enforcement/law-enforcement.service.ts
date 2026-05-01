import { Injectable } from '@nestjs/common';
import { IncidentsService } from '../incidents/incidents.service';
import { PerpetratorsService } from '../perpetrators/perpetrators.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class LawEnforcementService {
  constructor(
    private incidentsService: IncidentsService,
    private perpetratorsService: PerpetratorsService,
    private usersService: UsersService,
  ) {}

  // Dashboard Overview
  async getDashboard(userId: string) {
    // Get all cases and filter by law enforcement jurisdiction logic
    const allCases = await this.incidentsService.findAllIncidents();
    const myCases = allCases.filter(incident => this.hasJurisdictionAccess(incident, userId));
    const allMyCases = myCases;
    
    const totalCases = myCases.length;
    const activeCases = myCases.filter(c => c.status !== 'closed').length;
    const closedCases = myCases.filter(c => c.status === 'closed').length;
    const newCases = myCases.filter(c => c.status === 'reported').length;
    const underInvestigation = myCases.filter(c => c.status === 'under_investigation').length;
    const withAgency = myCases.filter(c => c.status === 'with_agency').length;

    const recentCases = allMyCases
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

    const perpetrators = await this.perpetratorsService.findAll();

    return {
      totalCases,
      activeCases,
      closedCases,
      newCases,
      underInvestigation,
      withAgency,
      recentCases,
      totalPerpetrators: perpetrators.length,
      caseStats: {
        reported: newCases,
        under_investigation: underInvestigation,
        with_agency: withAgency,
        closed: closedCases
      }
    };
  }

  // Case Investigation
  async getMyCases(userId: string) {
    const allCases = await this.incidentsService.findAllIncidents();
    const myCases = allCases.filter(incident => this.hasJurisdictionAccess(incident, userId));
    return myCases.map(incident => ({
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
    if (!incident || !this.hasJurisdictionAccess(incident, userId)) {
      throw new Error('Case not found or access denied');
    }
    return incident;
  }

  async updateCaseStatus(id: string, updateData: { status: string; notes?: string }, userId: string) {
    const incident = await this.incidentsService.findIncidentById(id);
    if (!incident || !this.hasJurisdictionAccess(incident, userId)) {
      throw new Error('Case not found or access denied');
    }
    
    return this.incidentsService.updateIncident(id, {
      status: updateData.status,
      ...(updateData.notes && { notes: updateData.notes })
    }, userId);
  }

  async addEvidence(id: string, evidenceData: any, userId: string) {
    const incident = await this.incidentsService.findIncidentById(id);
    if (!incident || !this.hasJurisdictionAccess(incident, userId)) {
      throw new Error('Case not found or access denied');
    }
    
    // Create a case update for evidence collection
    const caseUpdate = {
      incidentId: id,
      type: 'evidence',
      description: `Evidence collected: ${evidenceData.type || 'General evidence'}`,
      updatedBy: userId,
      updatedAt: new Date(),
      previousStatus: incident.status,
      newStatus: incident.status,
      metadata: evidenceData
    };
    
    return this.incidentsService.addCaseUpdate(caseUpdate);
  }

  async getCaseEvidence(id: string, userId: string) {
    const incident = await this.incidentsService.findIncidentById(id);
    if (!incident || !this.hasJurisdictionAccess(incident, userId)) {
      throw new Error('Case not found or access denied');
    }
    
    // Fetch case updates related to evidence for this incident
    const evidenceUpdates = await this.incidentsService.getCaseUpdates(id);
    return evidenceUpdates
      .filter((update: any) => update.type === 'evidence')
      .map((update: any) => ({
        id: `evidence_${(update as any)._id}`,
        type: update.metadata?.type || 'general',
        description: update.description,
        collectedAt: (update as any).updatedAt,
        collectedBy: update.updatedBy,
        metadata: update.metadata
      }));
  }

  // Perpetrator Management
  async getPerpetrators(userId: string) {
    const perpetrators = await this.perpetratorsService.findAll();
    return perpetrators.map(perpetrator => ({
      id: (perpetrator as any)._id,
      firstName: perpetrator.firstName,
      lastName: perpetrator.lastName,
      aliases: perpetrator.aliases,
      knownAssociations: perpetrator.knownAssociations,
      modusOperandi: perpetrator.modusOperandi,
      createdAt: (perpetrator as any).createdAt
    }));
  }

  async getPerpetratorById(id: string, userId: string) {
    const perpetrator = await this.perpetratorsService.findById(id);
    if (!perpetrator) {
      throw new Error('Perpetrator not found');
    }
    return perpetrator;
  }

  async updatePerpetrator(id: string, updateData: any, userId: string) {
    const perpetrator = await this.perpetratorsService.findById(id);
    if (!perpetrator) {
      throw new Error('Perpetrator not found');
    }
    
    // Update the perpetrator in the database
    return this.perpetratorsService.update(id, updateData);
  }

  async createPerpetrator(perpetratorData: any, userId: string) {
    // Create the perpetrator in the database
    return this.perpetratorsService.create({
      ...perpetratorData,
      createdBy: userId
    });
  }

  async searchPerpetrators(query: string, userId: string) {
    // Use the perpetrators service search method
    return this.perpetratorsService.search(query);
  }

  // Investigation Tools
  async getMyInvestigations(userId: string) {
    const allCases = await this.incidentsService.findAllIncidents();
    const cases = allCases.filter(incident => this.hasJurisdictionAccess(incident, userId));
    
    // Generate investigations based on active cases
    const investigations = cases
      .filter(incident => incident.status !== 'closed')
      .map(incident => ({
        id: `investigation_${(incident as any)._id}`,
        title: `Child Abuse Investigation - ${incident.caseRef}`,
        status: incident.status === 'under_investigation' ? 'active' : 'pending',
        priority: incident.abuseType === 'physical' || incident.abuseType === 'sexual' ? 'high' : 'medium',
        createdAt: (incident as any).createdAt,
        assignedTo: userId,
        caseId: (incident as any)._id,
        caseRef: incident.caseRef,
        abuseType: incident.abuseType,
        location: incident.location
      }));
    
    return investigations;
  }

  async createInvestigation(investigationData: any, userId: string) {
    // Verify user has access to the case
    if (investigationData.caseId) {
      const incident = await this.incidentsService.findIncidentById(investigationData.caseId);
      if (!incident || incident.jurisdiction !== userId) {
        throw new Error('Case not found or access denied');
      }
    }
    
    // Create a case update for the investigation
    const caseUpdate = {
      incidentId: investigationData.caseId,
      type: 'investigation',
      description: `Investigation created: ${investigationData.title || 'New investigation'}`,
      updatedBy: userId,
      updatedAt: new Date(),
      previousStatus: investigationData.previousStatus,
      newStatus: investigationData.newStatus || 'under_investigation'
    };
    
    // Update incident status if needed
    if (investigationData.newStatus) {
      await this.incidentsService.updateIncident(investigationData.caseId, {
        status: investigationData.newStatus
      }, userId);
    }
    
    return this.incidentsService.addCaseUpdate(caseUpdate);
  }

  async getInvestigationById(id: string, userId: string) {
    // Extract case ID from investigation ID
    const caseId = id.replace('investigation_', '');
    const incident = await this.incidentsService.findIncidentById(caseId);
    
    if (!incident || incident.jurisdiction !== userId) {
      throw new Error('Investigation not found or access denied');
    }
    
    return {
      id,
      title: `Investigation - ${incident.caseRef}`,
      description: `Investigation for case ${incident.caseRef} - Type: ${incident.abuseType}`,
      status: incident.status === 'under_investigation' ? 'active' : 'pending',
      createdAt: (incident as any).createdAt,
      assignedTo: userId,
      caseId,
      caseRef: incident.caseRef,
      abuseType: incident.abuseType,
      location: incident.location
    };
  }

  async updateInvestigation(id: string, updateData: any, userId: string) {
    // Extract case ID from investigation ID
    const caseId = id.replace('investigation_', '');
    const incident = await this.incidentsService.findIncidentById(caseId);
    
    if (!incident || incident.jurisdiction !== userId) {
      throw new Error('Investigation not found or access denied');
    }
    
    // Create a case update for the investigation change
    const caseUpdate = {
      incidentId: caseId,
      type: 'investigation',
      description: `Investigation updated: ${updateData.title || 'Updated'}`,
      updatedBy: userId,
      updatedAt: new Date(),
      previousStatus: incident.status,
      newStatus: updateData.status || incident.status
    };
    
    // Update incident status if provided
    if (updateData.status && updateData.status !== incident.status) {
      await this.incidentsService.updateIncident(caseId, {
        status: updateData.status
      }, userId);
    }
    
    return this.incidentsService.addCaseUpdate(caseUpdate);
  }

  // Warrants and Legal Actions
  async getWarrants(userId: string) {
    const allCases = await this.incidentsService.findAllIncidents();
    const cases = allCases.filter(incident => this.hasJurisdictionAccess(incident, userId));
    
    // Generate warrants based on cases with identified perpetrators
    const warrants = cases
      .filter(incident => incident.perpetratorId && incident.status === 'under_investigation')
      .slice(0, 5) // Limit to recent cases
      .map(incident => {
        const perpetrator = incident.perpetratorId as any;
        return {
          id: `warrant_${(incident as any)._id}`,
          type: 'arrest',
          target: `${perpetrator?.firstName || 'Unknown'} ${perpetrator?.lastName || 'Suspect'}`,
          status: 'pending',
          issuedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          caseId: (incident as any)._id,
          caseRef: incident.caseRef
        };
      });
    
    return warrants;
  }

  async createWarrant(warrantData: any, userId: string) {
    // Verify user has access to the case
    if (warrantData.caseId) {
      const incident = await this.incidentsService.findIncidentById(warrantData.caseId);
      if (!incident || incident.jurisdiction !== userId) {
        throw new Error('Case not found or access denied');
      }
    }
    
    // Create a case update for the warrant
    const caseUpdate = {
      incidentId: warrantData.caseId,
      type: 'warrant',
      description: `Warrant created: ${warrantData.type} warrant for ${warrantData.target}`,
      updatedBy: userId,
      updatedAt: new Date(),
      previousStatus: warrantData.previousStatus,
      newStatus: warrantData.newStatus,
      metadata: warrantData
    };
    
    return this.incidentsService.addCaseUpdate(caseUpdate);
  }

  async getWarrantById(id: string, userId: string) {
    // Extract case ID from warrant ID
    const caseId = id.replace('warrant_', '');
    const incident = await this.incidentsService.findIncidentById(caseId);
    
    if (!incident || incident.jurisdiction !== userId) {
      throw new Error('Warrant not found or access denied');
    }
    
    const perpetrator = incident.perpetratorId as any;
    return {
      id,
      type: 'arrest',
      target: `${perpetrator?.firstName || 'Unknown'} ${perpetrator?.lastName || 'Suspect'}`,
      status: 'pending',
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      caseId,
      caseRef: incident.caseRef,
      perpetrator: perpetrator
    };
  }

  // Reports and Documentation
  async getMyReports(userId: string) {
    const allCases = await this.incidentsService.findAllIncidents();
    const cases = allCases.filter(incident => this.hasJurisdictionAccess(incident, userId));
    
    // Generate reports based on user's cases
    const reports = cases.map(incident => ({
      id: `report_${(incident as any)._id}`,
      title: `Investigation Report - ${incident.caseRef}`,
      type: 'investigation',
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
      if (!incident || incident.jurisdiction !== userId) {
        throw new Error('Case not found or access denied');
      }
    }
    
    // Create a case update for the report
    const caseUpdate = {
      incidentId: reportData.caseId,
      type: 'report',
      description: `Report created: ${reportData.title || 'New report'}`,
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
    
    if (!incident || incident.jurisdiction !== userId) {
      throw new Error('Report not found or access denied');
    }
    
    return {
      id,
      title: `Investigation Report - ${incident.caseRef}`,
      content: `Investigation report for case ${incident.caseRef} - Status: ${incident.status}`,
      type: 'investigation',
      caseId: incidentId,
      caseRef: incident.caseRef,
      createdAt: (incident as any).createdAt,
      status: incident.status === 'closed' ? 'completed' : 'in_progress'
    };
  }

  // Statistics and Analytics
  async getMyStatistics(userId: string) {
    const dashboard = await this.getDashboard(userId);
    return {
      casesByStatus: dashboard.caseStats,
      casesByType: await this.getCasesByType(userId),
      monthlyTrend: await this.getMonthlyTrend(userId)
    };
  }

  async getMyAnalytics(userId: string) {
    const allCases = await this.incidentsService.findAllIncidents();
    const myCases = allCases.filter(incident => this.hasJurisdictionAccess(incident, userId));
    const closedCases = myCases.filter(c => c.status === 'closed');
    
    const averageResolutionTime = closedCases.length > 0 
      ? closedCases.reduce((total, case_) => {
          const created = new Date((case_ as any).createdAt);
          const updated = new Date((case_ as any).updatedAt);
          return total + (updated.getTime() - created.getTime());
        }, 0) / closedCases.length / (1000 * 60 * 60 * 24)
      : 0;

    // Count perpetrators with arrests from case updates
    const perpetratorArrests = await this.countArrests(userId);
    const warrantsIssued = await this.countWarrants(userId);

    return {
      totalCases: myCases.length,
      closedCases: closedCases.length,
      averageResolutionTime: Math.round(averageResolutionTime),
      activeCases: myCases.filter(c => c.status !== 'closed').length,
      completionRate: myCases.length > 0 ? Math.round((closedCases.length / myCases.length) * 100) : 0,
      perpetratorArrests,
      warrantsIssued
    };
  }

  // Case Collaboration
  async getMyCollaborations(userId: string) {
    const allCases = await this.incidentsService.findAllIncidents();
    const cases = allCases.filter(incident => this.hasJurisdictionAccess(incident, userId));
    
    // Generate collaborations based on cases that have social workers assigned
    const collaborations = cases
      .filter(incident => incident.assigneeId) // Cases with social workers assigned
      .map(incident => ({
        id: `collaboration_${(incident as any)._id}`,
        caseId: (incident as any)._id,
        caseRef: incident.caseRef,
        with: 'Social Worker',
        type: 'case_update',
        status: incident.status === 'closed' ? 'completed' : 'active',
        createdAt: (incident as any).createdAt,
        socialWorkerId: incident.assigneeId
      }));
    
    return collaborations;
  }

  async createCollaboration(collaborationData: any, userId: string) {
    // Verify user has access to the case
    if (collaborationData.caseId) {
      const incident = await this.incidentsService.findIncidentById(collaborationData.caseId);
      if (!incident || incident.jurisdiction !== userId) {
        throw new Error('Case not found or access denied');
      }
    }
    
    // Create a case update for the collaboration
    const caseUpdate = {
      incidentId: collaborationData.caseId,
      type: 'collaboration',
      description: `Collaboration initiated with ${collaborationData.with || 'Social Worker'}`,
      updatedBy: userId,
      updatedAt: new Date(),
      previousStatus: collaborationData.previousStatus,
      newStatus: collaborationData.newStatus,
      metadata: collaborationData
    };
    
    return this.incidentsService.addCaseUpdate(caseUpdate);
  }

  // Alerts and Notifications
  async getMyAlerts(userId: string) {
    const allCases = await this.incidentsService.findAllIncidents();
    const cases = allCases.filter(incident => this.hasJurisdictionAccess(incident, userId));
    
    // Generate alerts based on critical cases
    const alerts = cases
      .filter(incident => 
        incident.status === 'reported' || 
        incident.abuseType === 'physical' || 
        incident.abuseType === 'sexual'
      )
      .slice(0, 5) // Limit to recent cases
      .map(incident => ({
        id: `alert_${(incident as any)._id}`,
        type: incident.abuseType === 'physical' || incident.abuseType === 'sexual' ? 'high_priority' : 'medium_priority',
        message: `Case ${incident.caseRef} requires attention - ${incident.abuseType} abuse reported`,
        createdAt: (incident as any).createdAt,
        status: 'unread',
        caseId: (incident as any)._id,
        caseRef: incident.caseRef
      }));
    
    return alerts;
  }

  async createAlert(alertData: any, userId: string) {
    // Verify user has access to the case
    if (alertData.caseId) {
      const incident = await this.incidentsService.findIncidentById(alertData.caseId);
      if (!incident || incident.jurisdiction !== userId) {
        throw new Error('Case not found or access denied');
      }
    }
    
    // Create a case update for the alert
    const caseUpdate = {
      incidentId: alertData.caseId,
      type: 'alert',
      description: alertData.message || 'New alert created',
      updatedBy: userId,
      updatedAt: new Date(),
      previousStatus: alertData.previousStatus,
      newStatus: alertData.newStatus,
      metadata: alertData
    };
    
    return this.incidentsService.addCaseUpdate(caseUpdate);
  }

  // Helper methods
  private async getCasesByType(userId: string) {
    const allCases = await this.incidentsService.findAllIncidents();
    const cases = allCases.filter(incident => this.hasJurisdictionAccess(incident, userId));
    return cases.reduce((acc, case_) => {
      acc[case_.abuseType] = (acc[case_.abuseType] || 0) + 1;
      return acc;
    }, {});
  }

  private async getMonthlyTrend(userId: string) {
    const allCases = await this.incidentsService.findAllIncidents();
    const cases = allCases.filter(incident => this.hasJurisdictionAccess(incident, userId));
    const monthlyData = cases.reduce((acc, case_) => {
      const month = new Date((case_ as any).createdAt).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      count
    })).sort((a, b) => a.month.localeCompare(b.month));
  }

  private async countArrests(userId: string): Promise<number> {
    const allCases = await this.incidentsService.findAllIncidents();
    const cases = allCases.filter(incident => this.hasJurisdictionAccess(incident, userId));
    // Count cases that resulted in arrests (closed with perpetrator identified)
    return cases.filter(incident => 
      incident.status === 'closed' && 
      incident.perpetratorId
    ).length;
  }

  private async countWarrants(userId: string): Promise<number> {
    // Count warrant-related case updates for user's cases
    const allCases = await this.incidentsService.findAllIncidents();
    const cases = allCases.filter(incident => this.hasJurisdictionAccess(incident, userId));
    let warrantCount = 0;
    
    for (const incident of cases) {
      const updates = await this.incidentsService.getCaseUpdates((incident as any)._id);
      warrantCount += updates.filter((update: any) => update.type === 'warrant').length;
    }
    
    return warrantCount;
  }

  private hasJurisdictionAccess(incident: any, userId: string): boolean {
    // For now, give all law enforcement users access to all cases
    // In a real system, this would be based on actual jurisdiction mapping
    // For demo purposes, we'll allow access to all cases
    return true;
  }
}
