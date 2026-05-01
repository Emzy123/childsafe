import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Incident, IncidentSchema } from './entities/incident.entity';
import { Victim, VictimSchema } from './entities/victim.entity';
import { Perpetrator, PerpetratorSchema } from './entities/perpetrator.entity';
import { CaseUpdate, CaseUpdateSchema } from './entities/case-update.entity';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Incident.name, schema: IncidentSchema },
      { name: Victim.name, schema: VictimSchema },
      { name: Perpetrator.name, schema: PerpetratorSchema },
      { name: CaseUpdate.name, schema: CaseUpdateSchema },
    ])
  ],
  providers: [IncidentsService],
  controllers: [IncidentsController],
  exports: [IncidentsService],
})
export class IncidentsModule {}
