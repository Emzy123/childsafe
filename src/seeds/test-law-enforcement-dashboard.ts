import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { LawEnforcementService } from '../law-enforcement/law-enforcement.service';
import { UsersService } from '../users/users.service';

async function testLawEnforcementDashboard() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const lawEnforcementService = app.get(LawEnforcementService);
  const usersService = app.get(UsersService);

  console.log('Testing Law Enforcement Dashboard...');

  // Get law enforcement user
  const users = await usersService.findAll();
  const lawEnforcementUser = users.find(u => u.role === 'law_enforcement');

  if (!lawEnforcementUser) {
    console.error('❌ No law enforcement user found!');
    await app.close();
    return;
  }

  console.log(`✓ Found law enforcement user: ${lawEnforcementUser.email}`);
  console.log(`✓ User ID: ${(lawEnforcementUser as any)._id}`);

  try {
    // Test dashboard data
    const dashboard = await lawEnforcementService.getDashboard((lawEnforcementUser as any)._id);
    console.log('\n📊 Dashboard Data:');
    console.log(`  Total Cases: ${dashboard.totalCases}`);
    console.log(`  Active Cases: ${dashboard.activeCases}`);
    console.log(`  Closed Cases: ${dashboard.closedCases}`);
    console.log(`  New Cases: ${dashboard.newCases}`);
    console.log(`  Under Investigation: ${dashboard.underInvestigation}`);
    console.log(`  With Agency: ${dashboard.withAgency}`);
    console.log(`  Total Perpetrators: ${dashboard.totalPerpetrators}`);
    console.log(`  Recent Cases: ${dashboard.recentCases.length}`);

    // Test cases
    const cases = await lawEnforcementService.getMyCases((lawEnforcementUser as any)._id);
    console.log(`\n📁 My Cases: ${cases.length}`);
    cases.forEach((case_, index) => {
      console.log(`  ${index + 1}. ${case_.caseRef} - ${case_.abuseType} - ${case_.status}`);
    });

    // Test investigations
    const investigations = await lawEnforcementService.getMyInvestigations((lawEnforcementUser as any)._id);
    console.log(`\n🔍 My Investigations: ${investigations.length}`);
    investigations.forEach((inv, index) => {
      console.log(`  ${index + 1}. ${inv.title} - ${inv.status} - ${inv.priority}`);
    });

    // Test perpetrators
    const perpetrators = await lawEnforcementService.getPerpetrators((lawEnforcementUser as any)._id);
    console.log(`\n👥 Perpetrators: ${perpetrators.length}`);
    perpetrators.forEach((perp, index) => {
      console.log(`  ${index + 1}. ${perp.firstName} ${perp.lastName} - ${perp.aliases || 'No aliases'}`);
    });

    // Test warrants
    const warrants = await lawEnforcementService.getWarrants((lawEnforcementUser as any)._id);
    console.log(`\n⚖️  Warrants: ${warrants.length}`);
    warrants.forEach((warrant, index) => {
      console.log(`  ${index + 1}. ${warrant.type} warrant for ${warrant.target} - ${warrant.status}`);
    });

    console.log('\n✅ Law Enforcement Dashboard test completed successfully!');

  } catch (error) {
    console.error('❌ Error testing dashboard:', error.message);
  }

  await app.close();
}

testLawEnforcementDashboard().catch(console.error);
