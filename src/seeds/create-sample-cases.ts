import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { IncidentsService } from '../incidents/incidents.service';
import { UsersService } from '../users/users.service';
import { CreateIncidentDto } from '../incidents/dto/create-incident.dto';

async function createSampleCases() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const incidentsService = app.get(IncidentsService);
  const usersService = app.get(UsersService);

  console.log('Creating sample cases...');

  // Get a social worker user to assign cases to
  const socialWorkers = await usersService.findAll();
  const socialWorker = socialWorkers.find(u => u.role === 'social_worker');

  const sampleCases: CreateIncidentDto[] = [
    {
      victimFirstName: 'Sarah',
      victimLastName: 'Johnson',
      victimApproximateAge: 12,
      abuseType: 'physical',
      description: 'Child reported being hit by guardian with belt multiple times over past month. Shows bruises on arms and legs.',
      incidentDate: '2024-01-15',
      location: 'Lagos, Nigeria',
      assigneeId: socialWorker ? (socialWorker as any)._id : undefined,
      jurisdiction: 'Lagos State'
    },
    {
      victimFirstName: 'Michael',
      victimLastName: 'Okafor',
      victimApproximateAge: 8,
      abuseType: 'sexual',
      description: 'Teacher reported inappropriate touching by school staff member. Child shows signs of trauma and withdrawal.',
      incidentDate: '2024-01-20',
      location: 'Abuja, Nigeria',
      assigneeId: socialWorker ? (socialWorker as any)._id : undefined,
      jurisdiction: 'FCT'
    },
    {
      victimFirstName: 'Amina',
      victimLastName: 'Muhammad',
      victimApproximateAge: 6,
      abuseType: 'neglect',
      description: 'Neighbors report child often left alone without food or supervision. Child appears malnourished and unkempt.',
      incidentDate: '2024-01-25',
      location: 'Kano, Nigeria',
      assigneeId: socialWorker ? (socialWorker as any)._id : undefined,
      jurisdiction: 'Kano State'
    },
    {
      victimFirstName: 'David',
      victimLastName: 'Chukwu',
      victimApproximateAge: 10,
      abuseType: 'emotional',
      description: 'Child reports constant verbal abuse and threats from step-parent. Shows signs of anxiety and low self-esteem.',
      incidentDate: '2024-02-01',
      location: 'Port Harcourt, Nigeria',
      assigneeId: socialWorker ? (socialWorker as any)._id : undefined,
      jurisdiction: 'Rivers State'
    },
    {
      victimFirstName: 'Fatima',
      victimLastName: 'Bello',
      victimApproximateAge: 14,
      abuseType: 'physical',
      description: 'School counselor reports child with unexplained injuries. Child reports being beaten for poor grades.',
      incidentDate: '2024-02-05',
      location: 'Ibadan, Nigeria',
      assigneeId: socialWorker ? (socialWorker as any)._id : undefined,
      jurisdiction: 'Oyo State'
    }
  ];

  for (const caseData of sampleCases) {
    try {
      const incident = await incidentsService.createIncident(caseData, (socialWorker as any)._id);
      console.log(`✓ Created case: ${incident.caseRef} - ${caseData.abuseType} abuse in ${caseData.location}`);
    } catch (error) {
      console.error(`✗ Error creating case:`, error.message);
    }
  }

  console.log('Sample cases creation completed!');
  await app.close();
}

createSampleCases().catch(console.error);
