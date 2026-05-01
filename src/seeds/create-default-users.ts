import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

async function createDefaultUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

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

  console.log('Creating default users...');

  for (const userData of defaultUsers) {
    try {
      // Check if user already exists
      const existingUser = await usersService.findByEmail(userData.email);
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await usersService.create({
        fullName: userData.fullName,
        email: userData.email,
        passwordHash: hashedPassword,
        role: userData.role,
      });

      console.log(`✓ Created ${userData.role} user: ${userData.email}`);
    } catch (error) {
      console.error(`✗ Error creating user ${userData.email}:`, error.message);
    }
  }

  console.log('Default users creation completed!');
  await app.close();
}

createDefaultUsers().catch(console.error);
