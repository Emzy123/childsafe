import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IncidentsModule } from './incidents/incidents.module';
import { PerpetratorsModule } from './perpetrators/perpetrators.module';
import { AdminModule } from './admin/admin.module';
import { SocialWorkerModule } from './social-worker/social-worker.module';
import { LawEnforcementModule } from './law-enforcement/law-enforcement.module';
import { databaseConfig } from './config/database.config';
import { SeederModule } from './seeds/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => databaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    IncidentsModule,
    PerpetratorsModule,
    AdminModule,
    SocialWorkerModule,
    LawEnforcementModule,
    SeederModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
