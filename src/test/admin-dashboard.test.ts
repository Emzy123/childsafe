import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Admin Dashboard Tests', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login as admin
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@childsafe.ng',
        password: 'Admin@123'
      });

    adminToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Dashboard Overview', () => {
    it('Should get dashboard overview', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body).toHaveProperty('totalIncidents');
      expect(response.body).toHaveProperty('activeIncidents');
      expect(response.body).toHaveProperty('totalPerpetrators');
      expect(response.body).toHaveProperty('recentCases');
      expect(response.body).toHaveProperty('userStats');
    });
  });

  describe('User Management', () => {
    it('Should get all users with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/users?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('Should search users', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/users?search=admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.users.length).toBeGreaterThan(0);
      expect(response.body.users[0].fullName.toLowerCase()).toContain('admin');
    });

    it('Should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'Test Social Worker',
          email: 'test-social@childsafe.ng',
          password: 'Test@123',
          role: 'social_worker'
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.fullName).toBe('Test Social Worker');
      expect(response.body.email).toBe('test-social@childsafe.ng');
      expect(response.body.role).toBe('social_worker');
    });

    it('Should update user role', async () => {
      // First create a user
      const createResponse = await request(app.getHttpServer())
        .post('/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'Role Test User',
          email: 'role-test@childsafe.ng',
          password: 'Test@123',
          role: 'social_worker'
        });

      const userId = createResponse.body.id;

      // Update role
      const response = await request(app.getHttpServer())
        .put(`/admin/users/${userId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'law_enforcement' })
        .expect(200);

      expect(response.body.role).toBe('law_enforcement');
    });

    it('Should update user status', async () => {
      // First create a user
      const createResponse = await request(app.getHttpServer())
        .post('/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'Status Test User',
          email: 'status-test@childsafe.ng',
          password: 'Test@123',
          role: 'social_worker'
        });

      const userId = createResponse.body.id;

      // Update status
      const response = await request(app.getHttpServer())
        .put(`/admin/users/${userId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false })
        .expect(200);

      expect(response.body.isActive).toBe(false);
    });

    it('Should delete a user', async () => {
      // First create a user
      const createResponse = await request(app.getHttpServer())
        .post('/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'Delete Test User',
          email: 'delete-test@childsafe.ng',
          password: 'Test@123',
          role: 'social_worker'
        });

      const userId = createResponse.body.id;

      // Delete user
      const response = await request(app.getHttpServer())
        .delete(`/admin/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.deleted).toBe(true);
    });
  });

  describe('Case Management', () => {
    it('Should get all incidents with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/incidents?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('incidents');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.incidents)).toBe(true);
    });

    it('Should filter incidents by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/incidents?status=reported')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.incidents.length).toBeGreaterThan(0);
      response.body.incidents.forEach(incident => {
        expect(incident.status).toBe('reported');
      });
    });

    it('Should reassign incident', async () => {
      // First create an incident (this would need proper implementation)
      const response = await request(app.getHttpServer())
        .put('/admin/incidents/test-incident-id/assign')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ assigneeId: 'test-assignee-id' })
        .expect(200);

      expect(response.body).toHaveProperty('assigneeId');
    });
  });

  describe('Statistics and Analytics', () => {
    it('Should get statistics overview', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/statistics/overview')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalCases');
      expect(response.body).toHaveProperty('statusBreakdown');
      expect(response.body).toHaveProperty('typeBreakdown');
      expect(response.body).toHaveProperty('averageResolutionTime');
      expect(response.body).toHaveProperty('monthlyTrend');
    });

    it('Should get cases by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/statistics/cases-by-status')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(typeof response.body).toBe('object');
      expect(Object.keys(response.body).length).toBeGreaterThan(0);
    });

    it('Should get cases by type', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/statistics/cases-by-type')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(typeof response.body).toBe('object');
      expect(Object.keys(response.body).length).toBeGreaterThan(0);
    });

    it('Should get cases by location', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/statistics/cases-by-location')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(typeof response.body).toBe('object');
    });

    it('Should get user performance metrics', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/statistics/user-performance')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('userId');
        expect(response.body[0]).toHaveProperty('fullName');
        expect(response.body[0]).toHaveProperty('role');
        expect(response.body[0]).toHaveProperty('totalCases');
        expect(response.body[0]).toHaveProperty('closedCases');
        expect(response.body[0]).toHaveProperty('activeCases');
      }
    });
  });

  describe('Perpetrator Management', () => {
    it('Should get all perpetrators with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/perpetrators?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('perpetrators');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.perpetrators)).toBe(true);
    });

    it('Should search perpetrators', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/perpetrators/search/test')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('System Configuration', () => {
    it('Should get system configuration', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/system/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('systemName');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('maintenanceMode');
      expect(response.body).toHaveProperty('allowAnonymousReporting');
      expect(response.body).toHaveProperty('passwordPolicy');
    });

    it('Should update system configuration', async () => {
      const response = await request(app.getHttpServer())
        .put('/admin/system/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          systemName: 'Updated System Name',
          maintenanceMode: false,
          allowAnonymousReporting: true
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('config');
    });
  });

  describe('Audit Logs', () => {
    it('Should get audit logs with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/audit-logs?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('logs');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.logs)).toBe(true);
    });

    it('Should filter audit logs by user', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/audit-logs?userId=user1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body.logs)).toBe(true);
    });

    it('Should filter audit logs by action', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/audit-logs?action=LOGIN')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body.logs)).toBe(true);
    });
  });

  describe('Data Export', () => {
    it('Should export cases data', async () => {
      const response = await request(app.getHttpServer())
        .post('/admin/export/cases')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          format: 'csv',
          filters: { status: 'reported' }
        })
        .expect(200);

      expect(response.body).toHaveProperty('downloadUrl');
      expect(response.body).toHaveProperty('filename');
      expect(response.body).toHaveProperty('generatedAt');
    });

    it('Should export users data', async () => {
      const response = await request(app.getHttpServer())
        .post('/admin/export/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          format: 'excel',
          filters: { role: 'social_worker' }
        })
        .expect(200);

      expect(response.body).toHaveProperty('downloadUrl');
      expect(response.body).toHaveProperty('filename');
      expect(response.body).toHaveProperty('generatedAt');
    });

    it('Should export statistics', async () => {
      const response = await request(app.getHttpServer())
        .post('/admin/export/statistics')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          format: 'pdf',
          reportType: 'monthly_summary',
          filters: { startDate: '2024-01-01', endDate: '2024-12-31' }
        })
        .expect(200);

      expect(response.body).toHaveProperty('downloadUrl');
      expect(response.body).toHaveProperty('filename');
      expect(response.body).toHaveProperty('generatedAt');
    });
  });

  describe('System Health', () => {
    it('Should get system health status', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/system/health')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memoryUsage');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('activeUsers');
      expect(response.body).toHaveProperty('errorRate');
    });
  });

  describe('Notifications', () => {
    it('Should get notifications', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('title');
        expect(response.body[0]).toHaveProperty('message');
        expect(response.body[0]).toHaveProperty('type');
        expect(response.body[0]).toHaveProperty('timestamp');
        expect(response.body[0]).toHaveProperty('read');
      }
    });

    it('Should create notification', async () => {
      const response = await request(app.getHttpServer())
        .post('/admin/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Test Notification',
          message: 'This is a test notification',
          type: 'info'
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('read');
    });
  });

  describe('Access Control', () => {
    it('Should deny access to non-admin users', async () => {
      // Login as social worker
      const socialWorkerLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'social@childsafe.ng',
          password: 'Worker@123'
        });

      const socialWorkerToken = socialWorkerLogin.body.access_token;

      // Try to access admin endpoint
      await request(app.getHttpServer())
        .get('/admin/dashboard')
        .set('Authorization', `Bearer ${socialWorkerToken}`)
        .expect(403);
    });

    it('Should deny access without authentication', async () => {
      await request(app.getHttpServer())
        .get('/admin/dashboard')
        .expect(401);
    });
  });
});
