import { Module } from '@nestjs/common';
import { LawEnforcementController } from './law-enforcement.controller';
import { LawEnforcementService } from './law-enforcement.service';
import { IncidentsModule } from '../incidents/incidents.module';
import { PerpetratorsModule } from '../perpetrators/perpetrators.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [IncidentsModule, PerpetratorsModule, UsersModule],
  controllers: [LawEnforcementController],
  providers: [LawEnforcementService],
  exports: [LawEnforcementService],
})
export class LawEnforcementModule {}
