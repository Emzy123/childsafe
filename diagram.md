# Child Abuse Reporting System Diagrams

This document contains the visual Mermaid diagrams representing the system's architecture, use cases, data flow, system flowchart, and Entity Relationship Diagram (ERD).

---

## 1. System Architecture

Shows the high-level technical components of the monorepo application and how they communicate.

```mermaid
graph TD
    Client[React + Vite Frontend] -->|JSON / REST API| API[NestJS Backend API]
    API -->|Mongoose ODM| DB[(MongoDB Database)]
    API -->|Passport JWT| Auth[Auth Guard / Security]
```

---

## 2. Use Case Diagram

Illustrates the roles of different system actors and the actions they can perform.

```mermaid
leftToRightDirection
actor Public as "Public / Anonymous"
actor Worker as "Social Worker"
actor Officer as "Law Enforcement"
actor Admin as "Administrator"

rectangle "Child Abuse Reporting System" {
    usecase UC1 as "Submit Anonymous Report"
    usecase UC2 as "Track Incident Status"
    usecase UC3 as "Manage Assigned Cases"
    usecase UC4 as "Update Case Investigation"
    usecase UC5 as "Manage Victims & Perpetrators"
    usecase UC6 as "Manage System Users"
    usecase UC7 as "View System Audit Logs"
end

Public --> UC1
Public --> UC2

Worker --> UC3
Worker --> UC5

Officer --> UC4
Officer --> UC5

Admin --> UC3
Admin --> UC5
Admin --> UC6
Admin --> UC7
```

---

## 3. Data Flow Diagram (Level 1)

Illustrates the movement of data between reporters, the database, workers, officers, and administrators.

```mermaid
graph LR
    Reporter[Anonymous Reporter] -- Submission Data --> Backend[Backend Server]
    Backend -- Save Incident --> DB[(Database)]
    DB -- Case Details --> Worker[Social Worker]
    Worker -- Case Updates --> Backend
    DB -- Case Details --> Officer[Law Enforcement]
    Officer -- Investigation Logs --> Backend
    DB -- Audit & Users --> Admin[Administrator]
    Admin -- Configuration & Users --> Backend
```

---

## 4. System Flowchart

Illustrates the operational process flow of case submission, assignment, investigation, and resolution.

```mermaid
flowchart TD
    Start([Start]) --> Submit[Report Submitted]
    Submit --> Anonymous{Anonymous?}
    Anonymous -- Yes --> GenerateRef[Generate Case Reference]
    Anonymous -- No --> Authenticate[Authenticate User Session]
    GenerateRef --> Save[Save to Database]
    Authenticate --> Save
    Save --> Assign[Admin Assigns Case to Officer/Worker]
    Assign --> Investigate[Investigate & Update Status]
    Investigate --> Resolved{Case Resolved?}
    Resolved -- No --> Investigate
    Resolved -- Yes --> Close[Close Case]
    Close --> End([End])
```

---

## 5. Entity Relationship Diagram (ERD)

Defines the collection schemas and references in the MongoDB database.

```mermaid
erDiagram
    USER {
        string fullName
        string email
        string passwordHash
        string role
        boolean isActive
    }
    VICTIM {
        string firstName
        string lastName
        date dateOfBirth
        int approximateAge
        string gender
        string address
        string contactInfo
    }
    PERPETRATOR {
        string firstName
        string lastName
        string aliases
        string address
        string knownAssociations
        string modusOperandi
    }
    INCIDENT {
        string caseRef
        string abuseType
        string description
        date incidentDate
        string location
        string status
        boolean isAnonymous
        string reporterContact
        string jurisdiction
    }
    CASE_UPDATE {
        string oldStatus
        string newStatus
        string notes
        string type
        string description
    }

    INCIDENT }o--|| USER : "assigned_to / assigneeId"
    INCIDENT }o--|| USER : "created_by / userId"
    INCIDENT ||--o| VICTIM : "involves / victimId"
    INCIDENT ||--o| PERPETRATOR : "involves / perpetratorId"
    CASE_UPDATE }o--|| INCIDENT : "applies_to / incidentId"
```
