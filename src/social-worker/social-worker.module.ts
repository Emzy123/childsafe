import { Module } from '@nestjs/common';
import { SocialWorkerController } from './social-worker.controller';
import { SocialWorkerService } from './social-worker.service';
import { IncidentsModule } from '../incidents/incidents.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [IncidentsModule, UsersModule],
  controllers: [SocialWorkerController],
  providers: [SocialWorkerService],
  exports: [SocialWorkerService],
})
export class SocialWorkerModule {}
