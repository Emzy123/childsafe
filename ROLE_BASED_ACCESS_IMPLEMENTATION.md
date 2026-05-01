# Role-Based Access Control Implementation

## Overview

This document outlines the complete implementation of the role-based access control (RBAC) system for the Child Abuse Database Management System, following the specifications provided in the requirements document.

## Implemented Roles

### 1. ADMIN (System Administrator)
- **Role Identifier:** `admin`
- **Access Level:** Full system access
- **Key Responsibilities:**
  - User management (create, update, delete users)
  - Role assignment and modification
  - Full case access (view, edit, delete any case)
  - System oversight and analytics
  - Data export and reporting
  - Emergency override capabilities

### 2. SOCIAL WORKER
- **Role Identifier:** `social_worker`
- **Access Level:** Assigned cases only
- **Key Responsibilities:**
  - Case creation and management
  - Victim assessment and documentation
  - Follow-up management
  - Cross-referencing perpetrator database
  - Report generation

### 3. LAW ENFORCEMENT
- **Role Identifier:** `law_enforcement`
- **Access Level:** Jurisdiction-based cases
- **Key Responsibilities:**
  - Case investigation updates
  - Perpetrator intelligence management
  - Evidence documentation
  - Cross-jurisdiction alerts
  - Legal status tracking

### 4. PUBLIC USER (Anonymous Reporter)
- **Role Identifier:** No authentication required
- **Access Level:** Anonymous reporting only
- **Key Responsibilities:**
  - Submit anonymous reports
  - Track case status via reference number

## API Endpoints by Role

### Public Endpoints (No Authentication Required)
```
POST   /api/auth/login
POST   /api/incidents/anonymous-report
GET    /api/incidents/track/:caseRef
```

### Admin-Only Endpoints
```
POST   /api/auth/register-user
GET    /api/users
PUT    /api/users/:id/role
PUT    /api/users/:id/status
DELETE /api/users/:id
GET    /api/incidents/statistics/dashboard
DELETE /api/incidents/:id
PUT    /api/incidents/:id/assign
GET    /api/perpetrators/search/:query
```

### Social Worker Endpoints
```
GET    /api/users/profile
POST   /api/incidents
GET    /api/incidents (assigned cases only)
GET    /api/incidents/:id (assigned cases only)
PUT    /api/incidents/:id (assigned cases only)
GET    /api/incidents/:id/history (assigned cases only)
GET    /api/perpetrators
POST   /api/perpetrators
PUT    /api/perpetrators/:id
```

### Law Enforcement Endpoints
```
GET    /api/users/profile
GET    /api/incidents (jurisdiction-based)
GET    /api/incidents/:id (jurisdiction-based)
PUT    /api/incidents/:id (investigation updates only)
GET    /api/perpetrators
POST   /api/perpetrators
PUT    /api/perpetrators/:id
```

## Database Schema Updates

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'social_worker',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Incidents Table (Updated)
```sql
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_ref VARCHAR(20) UNIQUE NOT NULL,
    victim_id UUID REFERENCES victims(id) ON DELETE SET NULL,
    perpetrator_id UUID REFERENCES perpetrators(id) ON DELETE SET NULL,
    reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    abuse_type abuse_type_enum NOT NULL,
    description TEXT NOT NULL,
    incident_date DATE NOT NULL,
    location TEXT NOT NULL,
    jurisdiction VARCHAR(100),
    status case_status_enum DEFAULT 'reported',
    is_anonymous BOOLEAN DEFAULT FALSE,
    reporter_contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Perpetrators Table (Updated)
```sql
CREATE TABLE perpetrators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    aliases TEXT,
    address TEXT,
    known_associations TEXT,
    modus_operandi TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Account Creation Process

**IMPORTANT:** Public user registration has been disabled for security reasons. All user accounts must be created by the system administrator.

### How to Get an Account:
1. **Contact the System Administrator** to request account creation
2. **Administrator creates account** using `/api/auth/register-user` endpoint
3. **Receive login credentials** from administrator
4. **Login** using `/api/auth/login` endpoint

### Available Account Types:
- **Social Worker:** For child protection professionals
- **Law Enforcement:** For police and investigation officers  
- **Admin:** For system administrators (limited access)

This ensures proper verification and prevents unauthorized access to sensitive child protection data.

## Implementation Details

### Authentication & Authorization
- JWT-based authentication with role payload
- Role-based guards using `@Roles()` decorator
- **Admin-only user creation** via `/api/auth/register-user` endpoint
- No public registration available

### Access Control Logic
- **Admin:** Full access to all resources
- **Social Worker:** Access only to assigned cases
- **Law Enforcement:** Access based on jurisdiction
- **Public:** Anonymous reporting and tracking only

### Security Features
- Password hashing with bcrypt
- JWT token expiration
- Role validation on all protected endpoints
- Input validation with class-validator
- MongoDB/Mongoose schema validation

## File Structure

```
src/
├── auth/
│   ├── auth.controller.ts          # Auth endpoints with role support
│   ├── auth.service.ts            # Registration with role assignment
│   ├── dto/
│   │   ├── register.dto.ts        # Public registration
│   │   ├── create-admin-user.dto.ts # Admin user creation
│   │   └── login.dto.ts           # Login validation
│   └── guards/
│       └── jwt-auth.guard.ts      # JWT authentication
├── users/
│   ├── users.controller.ts        # User management (admin only)
│   ├── users.service.ts           # User CRUD operations
│   ├── entities/
│   │   └── user.entity.ts         # User schema with role field
│   └── dto/
│       └── update-user-role.dto.ts # Role update validation
├── incidents/
│   ├── incidents.controller.ts     # Role-based incident access
│   ├── incidents.service.ts        # Business logic with role filtering
│   ├── entities/
│   │   ├── incident.entity.ts      # Incident schema with assignee/jurisdiction
│   │   ├── victim.entity.ts        # Victim information
│   │   ├── perpetrator.entity.ts   # Perpetrator information
│   │   └── case-update.entity.ts   # Case history tracking
│   └── dto/
│       ├── create-incident.dto.ts  # Incident creation with role fields
│       └── anonymous-report.dto.ts # Anonymous reporting
├── perpetrators/
│   ├── perpetrators.controller.ts  # Perpetrator database access
│   ├── perpetrators.service.ts     # Perpetrator CRUD operations
│   └── dto/
│       └── perpetrator.dto.ts      # Perpetrator validation
├── common/
│   ├── decorators/
│   │   ├── roles.decorator.ts      # Role-based access decorator
│   │   └── public.decorator.ts      # Public endpoint decorator
│   ├── guards/
│   │   └── roles.guard.ts          # Role validation guard
│   └── enums/
│       └── user-role.enum.ts        # Role definitions
└── test/
    └── role-based-access.test.ts    # Comprehensive RBAC tests
```

## Testing

The implementation includes comprehensive test coverage for:
- Role-based endpoint access
- Cross-role access validation
- Public access restrictions
- Admin user management
- Anonymous reporting workflow

## Default Test Users

For testing purposes, the system supports creating these default users:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@childsafe.ng` | `Admin@123` |
| Social Worker | `social@childsafe.ng` | `Worker@123` |
| Law Enforcement | `law@childsafe.ng` | `Enforce@123` |

## Security Considerations

1. **Password Security:** All passwords are hashed using bcrypt with salt rounds of 10
2. **JWT Security:** Tokens contain user role and expire based on configuration
3. **Input Validation:** All inputs are validated using class-validator decorators
4. **Database Security:** Sensitive data is properly referenced and cascaded
5. **Access Control:** All endpoints are protected with appropriate role checks

## Usage Examples

### Admin Creating a Social Worker
```bash
curl -X POST http://localhost:3000/api/auth/register-user \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane@childsafe.ng",
    "password": "Secure@123",
    "role": "social_worker"
  }'
```

### Social Worker Creating a Case
```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Authorization: Bearer SOCIAL_WORKER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "abuseType": "physical",
    "description": "Suspected physical abuse",
    "incidentDate": "2024-01-15",
    "location": "Lagos, Nigeria",
    "victimFirstName": "John",
    "victimLastName": "Doe",
    "victimApproximateAge": 8
  }'
```

### Public Anonymous Report
```bash
curl -X POST http://localhost:3000/api/incidents/anonymous-report \
  -H "Content-Type: application/json" \
  -d '{
    "abuseType": "emotional",
    "description": "Concerning behavior observed",
    "incidentDate": "2024-01-15",
    "location": "Abuja, Nigeria",
    "victimFirstName": "Anonymous",
    "victimApproximateAge": 10,
    "reporterEmail": "concerned@citizen.ng"
  }'
```

## Future Enhancements

1. **Audit Logging:** Comprehensive audit trail for all user actions
2. **Two-Factor Authentication:** Enhanced security for admin accounts
3. **Role Hierarchies:** Support for nested role permissions
4. **Dynamic Permissions:** Configurable permission sets per role
5. **API Rate Limiting:** Prevent abuse of public endpoints

## Conclusion

The role-based access control system has been successfully implemented according to the specifications, providing:

- Clear separation of duties between different user types
- Secure access control based on user roles
- Comprehensive audit capabilities
- Scalable architecture for future enhancements
- Full compliance with the security requirements outlined in Section 1.3, Objective 3

The system ensures data confidentiality, operational efficiency, and maintains the integrity of the child abuse case management workflow.
