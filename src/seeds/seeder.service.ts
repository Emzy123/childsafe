import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap() {
    await this.seedDefaultUsers();
  }

  private async seedDefaultUsers() {
    const defaultUsers = [
      {
        fullName: 'System Administrator',
        email: 'admin@childsafe.ng',
        password: 'Admin@123',
        role: UserRole.ADMIN,
      },
      {
        fullName: 'Social Worker Test',
        email: 'social@childsafe.ng',
        password: 'Worker@123',
        role: UserRole.SOCIAL_WORKER,
      },
      {
        fullName: 'Law Enforcement Test',
        email: 'law@childsafe.ng',
        password: 'Enforce@123',
        role: UserRole.LAW_ENFORCEMENT,
      },
    ];

    for (const userData of defaultUsers) {
      try {
        const existing = await this.usersService.findByEmail(userData.email);
        if (existing) {
          continue;
        }
        const passwordHash = await bcrypt.hash(userData.password, 10);
        await this.usersService.create({
          fullName: userData.fullName,
          email: userData.email,
          passwordHash,
          role: userData.role,
        });
        this.logger.log(`Seeded user: ${userData.email}`);
      } catch (error) {
        this.logger.error(`Failed to seed ${userData.email}: ${error.message}`);
      }
    }
  }
}
