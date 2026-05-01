# Child Abuse Reporting System

A NestJS-based system for reporting and managing child abuse cases with role-based access control.

## Phase 1: Database & Backend Setup - COMPLETED

### Features Implemented

- **PostgreSQL Database Schema** with all required tables
- **NestJS Project Structure** with modular architecture
- **TypeORM Entities** for all database tables
- **Basic API Endpoints** for CRUD operations
- **Environment Configuration** for development

## Phase 2: Authentication & RBAC - COMPLETED

### Features Implemented

- **JWT Authentication** with secure token generation
- **Role-Based Access Control (RBAC)** for all endpoints
- **User Registration & Login** endpoints
- **Protected Routes** with JWT guards
- **Role Decorators** for endpoint protection
- **Current User Decorator** for accessing authenticated user data

### Authentication Endpoints (`/auth`)

- `POST /auth/register` - Register new user (returns JWT token)
- `POST /auth/login` - User login (returns JWT token)
- `POST /auth/logout` - User logout (requires authentication)
- `GET /auth/profile` - Get current user profile (requires authentication)

### Role-Based Access Control

**Admin Role:**
- Full access to all endpoints
- Can create, update, and delete users
- Can delete incidents, victims, and perpetrators
- Full system management capabilities

**Social Worker Role:**
- Can create, read, and update incidents
- Can create, read, and update victims and perpetrators
- Can update incident status with history tracking
- Cannot delete records (except their own user profile)

**Law Enforcement Role:**
- Same permissions as Social Worker
- Can access all case information
- Can update incident status and case details

### Authentication Headers

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

### Example API Usage

1. **Register a new admin user:**
   ```bash
   POST /auth/register
   {
     "fullName": "Admin User",
     "email": "admin@example.com",
     "password": "securePassword",
     "role": "admin"
   }
   ```

2. **Login to get JWT token:**
   ```bash
   POST /auth/login
   {
     "email": "admin@example.com",
     "password": "securePassword"
   }
   ```

3. **Access protected endpoint:**
   ```bash
   GET /incidents
   Authorization: Bearer <JWT_TOKEN_FROM_LOGIN>
   ```

### Database Schema

The system includes the following tables:
- `users` - System users with role-based access (Admin, Social Worker, Law Enforcement)
- `victims` - Victim information and demographics
- `perpetrators` - Perpetrator information and known associations
- `incidents` - Core case/incident records
- `case_updates` - Historical log of case status changes
- `documents` - File attachments and evidence

### API Endpoints

#### Users (`/users`)
- `POST /users` - Create new user
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### Victims (`/victims`)
- `POST /victims` - Create new victim record
- `GET /victims` - List all victims
- `GET /victims/:id` - Get victim by ID
- `PUT /victims/:id` - Update victim
- `DELETE /victims/:id` - Delete victim

#### Perpetrators (`/perpetrators`)
- `POST /perpetrators` - Create new perpetrator record
- `GET /perpetrators` - List all perpetrators
- `GET /perpetrators/:id` - Get perpetrator by ID
- `PUT /perpetrators/:id` - Update perpetrator
- `DELETE /perpetrators/:id` - Delete perpetrator

#### Incidents (`/incidents`)
- `POST /incidents` - Create new incident/case
- `GET /incidents` - List all incidents
- `GET /incidents/:id` - Get incident by ID
- `GET /incidents/case/:caseRef` - Get incident by case reference
- `PUT /incidents/:id` - Update incident
- `PUT /incidents/:id/status` - Update incident status with history
- `GET /incidents/:id/history` - Get case update history
- `DELETE /incidents/:id` - Delete incident

### Setup Instructions

1. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb child_abuse_db
   
   # Run schema migration
   psql -d child_abuse_db -f database/schema.sql
   ```

2. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Update database credentials in .env
   # Update JWT secret for production
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run start:dev
   ```

### Project Structure

```
src/
|-- config/
|   |-- database.config.ts
|-- auth/ (Phase 2)
|-- users/
|   |-- entities/
|   |   |-- user.entity.ts
|   |-- users.controller.ts
|   |-- users.service.ts
|   |-- users.module.ts
|-- victims/
|   |-- entities/
|   |   |-- victim.entity.ts
|   |-- victims.controller.ts
|   |-- victims.service.ts
|   |-- victims.module.ts
|-- perpetrators/
|   |-- entities/
|   |   |-- perpetrator.entity.ts
|   |-- perpetrators.controller.ts
|   |-- perpetrators.service.ts
|   |-- perpetrators.module.ts
|-- incidents/
|   |-- entities/
|   |   |-- incident.entity.ts
|   |   |-- case-update.entity.ts
|   |   |-- document.entity.ts
|   |   |-- index.ts
|   |-- incidents.controller.ts
|   |-- incidents.service.ts
|   |-- incidents.module.ts
|-- common/ (Phase 2)
|-- app.module.ts
|-- main.ts
```

### Next Phases

**Phase 2: Authentication & RBAC**
- JWT authentication
- Role-based access control
- Login/logout endpoints

**Phase 3: Public Anonymous Reporting**
- Public reporting form
- Anonymous case submission

**Phase 4: Case Management**
- Advanced search and filtering
- Case assignment and workflow

**Phase 5: Admin Dashboard & Analytics**
- Statistics and reporting
- Data visualization

**Phase 6: File Upload & Documentation**
- Document management
- File upload handling

### Technology Stack

- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (Phase 2)
- **Validation**: class-validator and class-transformer
- **Configuration**: @nestjs/config
