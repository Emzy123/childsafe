import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { IncidentsModule } from '../incidents/incidents.module';
import { PerpetratorsModule } from '../perpetrators/perpetrators.module';

@Module({
  imports: [UsersModule, IncidentsModule, PerpetratorsModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
