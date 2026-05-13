import api from './axios';

// ─── Social Worker ────────────────────────────────────────────────────────────
export const socialWorkerApi = {
  getDashboard: () => api.get('/social-worker/dashboard'),
  getCases: () => api.get('/social-worker/cases'),
  getStatistics: () => api.get('/social-worker/statistics'),
  getAppointments: () => api.get('/social-worker/appointments'),
  getPerformance: () => api.get('/social-worker/performance'),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (page = 1, limit = 20, search = '') =>
    api.get('/admin/users', { params: { page, limit, search } }),
  getIncidents: (page = 1, limit = 20, status = '', assignee = '') =>
    api.get('/admin/incidents', { params: { page, limit, status, assignee } }),
  getStatisticsOverview: (startDate, endDate) =>
    api.get('/admin/statistics/overview', { params: { startDate, endDate } }),
  getCasesByStatus: () => api.get('/admin/statistics/cases-by-status'),
  getCasesByType: () => api.get('/admin/statistics/cases-by-type'),
  getCasesByLocation: () => api.get('/admin/statistics/cases-by-location'),
  getUserPerformance: () => api.get('/admin/statistics/user-performance'),
  getSystemHealth: () => api.get('/admin/system/health'),
  getAuditLogs: (page = 1, limit = 20) =>
    api.get('/admin/audit-logs', { params: { page, limit } }),
  getNotifications: () => api.get('/admin/notifications'),
};

// ─── Law Enforcement ─────────────────────────────────────────────────────────
export const lawEnforcementApi = {
  getDashboard: () => api.get('/law-enforcement/dashboard'),
  getCases: () => api.get('/law-enforcement/cases'),
  getInvestigations: () => api.get('/law-enforcement/investigations'),
  getPerpetrators: () => api.get('/law-enforcement/perpetrators'),
  getWarrants: () => api.get('/law-enforcement/warrants'),
  getStatistics: () => api.get('/law-enforcement/statistics'),
  getAnalytics: () => api.get('/law-enforcement/analytics'),
  getAlerts: () => api.get('/law-enforcement/alerts'),
};
