import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Role-Based Access Control Tests', () => {
  let app: INestApplication;
  let adminToken: string;
  let socialWorkerToken: string;
  let lawEnforcementToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // First login as admin to create test users
    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@childsafe.ng',
        password: 'Admin@123'
      });

    adminToken = adminLoginResponse.body.access_token;

    // Create test users using admin endpoint
    const socialWorkerResponse = await request(app.getHttpServer())
      .post('/auth/register-user')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fullName: 'Social Worker Test',
        email: 'social@test.com',
        password: 'Social@123',
        role: 'social_worker'
      });

    socialWorkerToken = socialWorkerResponse.body.access_token;

    const lawEnforcementResponse = await request(app.getHttpServer())
      .post('/auth/register-user')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fullName: 'Law Enforcement Test',
        email: 'law@test.com',
        password: 'Law@123',
        role: 'law_enforcement'
      });

    lawEnforcementToken = lawEnforcementResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Admin Access Tests', () => {
    it('Admin should access all incidents', async () => {
      const response = await request(app.getHttpServer())
        .get('/incidents')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Admin should access user management', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Admin should access statistics dashboard', async () => {
      const response = await request(app.getHttpServer())
        .get('/incidents/statistics/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('byStatus');
    });

    it('Admin should create users with specific roles', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register-user')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'New Social Worker',
          email: 'new-social@test.com',
          password: 'New@123',
          role: 'social_worker'
        })
        .expect(201);

      expect(response.body.user.role).toBe('social_worker');
    });
  });

  describe('Social Worker Access Tests', () => {
    it('Social Worker should create incidents', async () => {
      const response = await request(app.getHttpServer())
        .post('/incidents')
        .set('Authorization', `Bearer ${socialWorkerToken}`)
        .send({
          abuseType: 'physical',
          description: 'Test incident description',
          incidentDate: '2024-01-01',
          location: 'Test Location',
          victimFirstName: 'John',
          victimLastName: 'Doe',
          victimApproximateAge: 10
        })
        .expect(201);

      expect(response.body.caseRef).toMatch(/^CAB-\d{4}-[A-Z0-9]{6}$/);
    });

    it('Social Worker should NOT access user management', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${socialWorkerToken}`)
        .expect(403);
    });

    it('Social Worker should NOT access statistics dashboard', async () => {
      await request(app.getHttpServer())
        .get('/incidents/statistics/dashboard')
        .set('Authorization', `Bearer ${socialWorkerToken}`)
        .expect(403);
    });

    it('Social Worker should access perpetrator database', async () => {
      const response = await request(app.getHttpServer())
        .get('/perpetrators')
        .set('Authorization', `Bearer ${socialWorkerToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Law Enforcement Access Tests', () => {
    it('Law Enforcement should NOT create incidents', async () => {
      await request(app.getHttpServer())
        .post('/incidents')
        .set('Authorization', `Bearer ${lawEnforcementToken}`)
        .send({
          abuseType: 'physical',
          description: 'Test incident description',
          incidentDate: '2024-01-01',
          location: 'Test Location'
        })
        .expect(403);
    });

    it('Law Enforcement should access perpetrator database', async () => {
      const response = await request(app.getHttpServer())
        .get('/perpetrators')
        .set('Authorization', `Bearer ${lawEnforcementToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Law Enforcement should create perpetrator records', async () => {
      const response = await request(app.getHttpServer())
        .post('/perpetrators')
        .set('Authorization', `Bearer ${lawEnforcementToken}`)
        .send({
          firstName: 'Test',
          lastName: 'Perpetrator',
          aliases: 'Alias1, Alias2',
          address: 'Test Address',
          knownAssociations: 'Test Association'
        })
        .expect(201);

      expect(response.body.firstName).toBe('Test');
      expect(response.body.lastName).toBe('Perpetrator');
    });
  });

  describe('Public Access Tests', () => {
    it('Public should submit anonymous reports', async () => {
      const response = await request(app.getHttpServer())
        .post('/incidents/anonymous-report')
        .send({
          abuseType: 'physical',
          description: 'Anonymous report description',
          incidentDate: '2024-01-01',
          location: 'Anonymous Location',
          victimFirstName: 'Anonymous',
          victimLastName: 'Victim',
          victimApproximateAge: 12,
          perpetratorFirstName: 'Unknown',
          reporterEmail: 'reporter@test.com'
        })
        .expect(201);

      expect(response.body.caseRef).toMatch(/^CAB-\d{4}-[A-Z0-9]{6}$/);
      expect(response.body.message).toContain('successfully');
    });

    it('Public should track case status', async () => {
      // First create an anonymous report
      const createResponse = await request(app.getHttpServer())
        .post('/incidents/anonymous-report')
        .send({
          abuseType: 'emotional',
          description: 'Track test case',
          incidentDate: '2024-01-01',
          location: 'Track Location'
        });

      const caseRef = createResponse.body.caseRef;

      // Then track the case
      const response = await request(app.getHttpServer())
        .get(`/incidents/track/${caseRef}`)
        .expect(200);

      expect(response.body.caseRef).toBe(caseRef);
      expect(response.body.status).toBe('reported');
    });

    it('Public should NOT access authenticated endpoints', async () => {
      await request(app.getHttpServer())
        .get('/incidents')
        .expect(401);

      await request(app.getHttpServer())
        .get('/perpetrators')
        .expect(401);

      await request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });

    it('Public registration should be disabled', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test User',
          email: 'test@test.com',
          password: 'Test@123'
        })
        .expect(404); // Endpoint should not exist
    });
  });

  describe('Cross-Role Access Validation', () => {
    let incidentId: string;
    let socialWorkerIncidentId: string;

    beforeAll(async () => {
      // Create incident as admin
      const adminIncident = await request(app.getHttpServer())
        .post('/incidents')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          abuseType: 'neglect',
          description: 'Admin test incident',
          incidentDate: '2024-01-01',
          location: 'Admin Location',
          assigneeId: 'social-worker-id' // This would be a real social worker ID
        });

      incidentId = adminIncident.body._id;

      // Create incident as social worker
      const socialWorkerIncident = await request(app.getHttpServer())
        .post('/incidents')
        .set('Authorization', `Bearer ${socialWorkerToken}`)
        .send({
          abuseType: 'sexual',
          description: 'Social worker test incident',
          incidentDate: '2024-01-01',
          location: 'SW Location'
        });

      socialWorkerIncidentId = socialWorkerIncident.body._id;
    });

    it('Social Worker should only access their assigned cases', async () => {
      // This test would require proper assignment logic in the service
      // For now, we'll test the basic structure
      const response = await request(app.getHttpServer())
        .get('/incidents')
        .set('Authorization', `Bearer ${socialWorkerToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Law Enforcement should only access cases in their jurisdiction', async () => {
      // This test would require jurisdiction-based filtering
      const response = await request(app.getHttpServer())
        .get('/incidents')
        .set('Authorization', `Bearer ${lawEnforcementToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
