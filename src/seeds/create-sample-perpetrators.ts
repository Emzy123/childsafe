import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PerpetratorsService } from '../perpetrators/perpetrators.service';
import { IncidentsService } from '../incidents/incidents.service';

async function createSamplePerpetrators() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const perpetratorsService = app.get(PerpetratorsService);
  const incidentsService = app.get(IncidentsService);

  console.log('Creating sample perpetrators...');

  const samplePerpetrators = [
    {
      firstName: 'John',
      lastName: 'Doe',
      aliases: 'Johnny, JD',
      address: '123 Main St, Lagos, Nigeria',
      knownAssociations: 'Unknown',
      modusOperandi: ['Physical punishment', 'Intimidation']
    },
    {
      firstName: 'Robert',
      lastName: 'Johnson',
      aliases: 'Rob, Bobby',
      address: '456 School Rd, Abuja, Nigeria',
      knownAssociations: 'School staff',
      modusOperandi: ['Inappropriate touching', 'Grooming']
    },
    {
      firstName: 'Aisha',
      lastName: 'Bello',
      aliases: 'Mother',
      address: '789 Family Home, Kano, Nigeria',
      knownAssociations: 'Family members',
      modusOperandi: ['Neglect', 'Abandonment']
    },
    {
      firstName: 'James',
      lastName: 'Stepan',
      aliases: 'Step-Dad',
      address: '321 Suburban Ave, Port Harcourt, Nigeria',
      knownAssociations: 'Family',
      modusOperandi: ['Verbal abuse', 'Threats']
    },
    {
      firstName: 'Mr.',
      lastName: 'Smith',
      aliases: 'Teacher',
      address: '654 Education St, Ibadan, Nigeria',
      knownAssociations: 'School administration',
      modusOperandi: ['Physical punishment', 'Corporal punishment']
    }
  ];

  // Get all incidents to link perpetrators
  const incidents = await incidentsService.findAllIncidents();
  
  for (let i = 0; i < samplePerpetrators.length && i < incidents.length; i++) {
    try {
      const perpetrator = await perpetratorsService.create(samplePerpetrators[i]);
      
      // Link perpetrator to incident using direct model access
      const incident = incidents[i];
      (incident as any).perpetratorId = (perpetrator as any)._id;
      await (incident as any).save();
      
      console.log(`✓ Created perpetrator: ${perpetrator.firstName} ${perpetrator.lastName} for case ${incident.caseRef}`);
    } catch (error) {
      console.error(`✗ Error creating perpetrator:`, error.message);
    }
  }

  console.log('Sample perpetrators creation completed!');
  await app.close();
}

createSamplePerpetrators().catch(console.error);
