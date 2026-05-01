import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident } from './entities/incident.entity';
import { Victim } from './entities/victim.entity';
import { Perpetrator } from './entities/perpetrator.entity';
import { CaseUpdate } from './entities/case-update.entity';
import { AnonymousReportDto } from './dto/anonymous-report.dto';
import { CreateIncidentDto, UpdateIncidentDto } from './dto/create-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectModel(Incident.name)
    private incidentsModel: Model<Incident>,
    @InjectModel(Victim.name)
    private victimsModel: Model<Victim>,
    @InjectModel(Perpetrator.name)
    private perpetratorsModel: Model<Perpetrator>,
    @InjectModel(CaseUpdate.name)
    private caseUpdatesModel: Model<CaseUpdate>,
  ) {}

  private generateCaseRef(): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CAB-${year}-${random}`;
  }

  // PUBLIC: Anonymous reporting (Phase 3)
  async anonymousReport(reportDto: AnonymousReportDto): Promise<{ caseRef: string; message: string }> {
    let victim: any = null;
    if (reportDto.victimFirstName || reportDto.victimLastName) {
      victim = new this.victimsModel({
        firstName: reportDto.victimFirstName,
        lastName: reportDto.victimLastName,
        approximateAge: reportDto.victimApproximateAge,
        gender: reportDto.victimGender,
      });
      victim = await victim.save();
    }

    let perpetrator: any = null;
    if (reportDto.perpetratorFirstName) {
      perpetrator = new this.perpetratorsModel({
        firstName: reportDto.perpetratorFirstName,
        lastName: reportDto.perpetratorLastName || '',
        aliases: reportDto.perpetratorAliases,
      });
      perpetrator = await perpetrator.save();
    }

    const caseRef = this.generateCaseRef();
    const incident = new this.incidentsModel({
      caseRef,
      victimId: victim?._id,
      perpetratorId: perpetrator?._id,
      abuseType: reportDto.abuseType,
      description: reportDto.description,
      incidentDate: new Date(reportDto.incidentDate),
      location: reportDto.location,
      isAnonymous: true,
      reporterContact: reportDto.reporterEmail || reportDto.reporterPhone,
      status: 'reported',
    });
    await incident.save();

    return {
      caseRef,
      message: 'Report submitted successfully. Please save your case reference number for tracking.',
    };
  }

  // AUTHENTICATED: Create case (Social Worker, Law Enforcement, Admin)
  async createIncident(createDto: CreateIncidentDto, userId: string): Promise<Incident> {
    let victim: any = null;
    if (createDto.victimFirstName || createDto.victimLastName) {
      victim = new this.victimsModel({
        firstName: createDto.victimFirstName,
        lastName: createDto.victimLastName,
        approximateAge: createDto.victimApproximateAge,
      });
      victim = await victim.save();
    }

    let perpetrator: any = null;
    if (createDto.perpetratorFirstName) {
      perpetrator = new this.perpetratorsModel({
        firstName: createDto.perpetratorFirstName,
        lastName: createDto.perpetratorLastName || '',
      });
      perpetrator = await perpetrator.save();
    }

    const caseRef = this.generateCaseRef();
    const incident = new this.incidentsModel({
      caseRef,
      userId,
      victimId: victim?._id,
      perpetratorId: perpetrator?._id,
      abuseType: createDto.abuseType,
      description: createDto.description,
      incidentDate: new Date(createDto.incidentDate),
      location: createDto.location,
      isAnonymous: false,
      status: 'reported',
    });
    return await incident.save();
  }

  async findAllIncidents(): Promise<Incident[]> {
    return this.incidentsModel.find()
      .populate('victimId')
      .populate('perpetratorId')
      .exec();
  }

  async findIncidentById(id: string): Promise<Incident> {
    const incident = await this.incidentsModel.findById(id)
      .populate('victimId')
      .populate('perpetratorId')
      .exec();
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
    return incident;
  }

  async findIncidentByCaseRef(caseRef: string): Promise<Incident> {
    const incident = await this.incidentsModel.findOne({ caseRef }).exec();
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
    return incident;
  }

  async updateIncident(id: string, updateDto: UpdateIncidentDto, userId: string): Promise<Incident> {
    const incident = await this.findIncidentById(id);
    const oldStatus = incident.status;

    if (updateDto.status && updateDto.status !== oldStatus) {
      const caseUpdate = new this.caseUpdatesModel({
        incidentId: id,
        updatedBy: userId,
        oldStatus: oldStatus,
        newStatus: updateDto.status,
        notes: updateDto.notes,
      });
      await caseUpdate.save();
      (incident as any).status = updateDto.status;
    }

    if (updateDto.abuseType) (incident as any).abuseType = updateDto.abuseType;
    if (updateDto.description) (incident as any).description = updateDto.description;

    return await (incident as any).save();
  }

  async getCaseHistory(id: string): Promise<CaseUpdate[]> {
    return this.caseUpdatesModel.find({ incidentId: id }).sort({ createdAt: -1 }).exec();
  }

  async addCaseUpdate(caseUpdateData: any): Promise<CaseUpdate> {
    const caseUpdate = new this.caseUpdatesModel(caseUpdateData);
    return await caseUpdate.save();
  }

  async getCaseUpdates(incidentId: string): Promise<CaseUpdate[]> {
    return this.caseUpdatesModel.find({ incidentId }).sort({ createdAt: -1 }).exec();
  }

  async getStatistics(): Promise<any> {
    const total = await this.incidentsModel.countDocuments();
    
    const byStatus = await this.incidentsModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]).exec();

    const byAbuseType = await this.incidentsModel.aggregate([
      { $group: { _id: '$abuseType', count: { $sum: 1 } } },
      { $project: { abuseType: '$_id', count: 1, _id: 0 } }
    ]).exec();

    const byMonth = await this.incidentsModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 },
      { $project: { month: '$_id', count: 1, _id: 0 } }
    ]).exec();

    return { total, byStatus, byAbuseType, byMonth };
  }

  // Role-based access methods
  async findIncidentsByAssignee(assigneeId: string): Promise<Incident[]> {
    return this.incidentsModel.find({ assigneeId })
      .populate('victimId')
      .populate('perpetratorId')
      .exec();
  }

  async findIncidentsByJurisdiction(jurisdiction: string): Promise<Incident[]> {
    return this.incidentsModel.find({ jurisdiction })
      .populate('victimId')
      .populate('perpetratorId')
      .exec();
  }

  async deleteIncident(id: string): Promise<{ deleted: boolean }> {
    const result = await this.incidentsModel.findByIdAndDelete(id).exec();
    return { deleted: !!result };
  }

  async reassignCase(id: string, assigneeId: string): Promise<Incident> {
    const incident = await this.findIncidentById(id);
    (incident as any).assigneeId = assigneeId;
    return await (incident as any).save();
  }
}
