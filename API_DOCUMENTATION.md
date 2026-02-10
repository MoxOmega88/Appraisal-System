# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register Faculty

**POST** `/auth/register`

Register a new faculty member.

**Request Body:**
```json
{
  "name": "Dr. John Doe",
  "email": "john.doe@university.edu",
  "password": "securePassword123",
  "employeeId": "EMP001",
  "department": "Computer Science",
  "designation": "Associate Professor",
  "joiningDate": "2020-01-15"
}
```

**Response:** `201 Created`
```json
{
  "_id": "64abc123...",
  "name": "Dr. John Doe",
  "email": "john.doe@university.edu",
  "employeeId": "EMP001",
  "department": "Computer Science",
  "designation": "Associate Professor",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "john.doe@university.edu",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "_id": "64abc123...",
  "name": "Dr. John Doe",
  "email": "john.doe@university.edu",
  "employeeId": "EMP001",
  "department": "Computer Science",
  "designation": "Associate Professor",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Profile

**GET** `/auth/profile` 🔒

Get current user profile.

**Response:** `200 OK`
```json
{
  "_id": "64abc123...",
  "name": "Dr. John Doe",
  "email": "john.doe@university.edu",
  "employeeId": "EMP001",
  "department": "Computer Science",
  "designation": "Associate Professor",
  "joiningDate": "2020-01-15T00:00:00.000Z"
}
```

---

## Terms

### Get All Terms

**GET** `/terms` 🔒

Get all terms for the authenticated faculty.

**Response:** `200 OK`
```json
[
  {
    "_id": "64def456...",
    "facultyId": "64abc123...",
    "termName": "Monsoon 2024",
    "academicYear": "2024-2025",
    "startDate": "2024-07-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "durationMonths": 6,
    "isActive": true,
    "createdAt": "2024-06-01T10:00:00.000Z",
    "updatedAt": "2024-06-01T10:00:00.000Z"
  }
]
```

### Create Term

**POST** `/terms` 🔒

Create a new term.

**Request Body:**
```json
{
  "termName": "Monsoon 2024",
  "academicYear": "2024-2025",
  "startDate": "2024-07-01",
  "endDate": "2024-12-31",
  "durationMonths": 6,
  "isActive": true
}
```

**Response:** `201 Created`

### Update Term

**PUT** `/terms/:id` 🔒

Update an existing term.

**Request Body:** Same as Create Term

**Response:** `200 OK`

### Delete Term

**DELETE** `/terms/:id` 🔒

Delete a term.

**Response:** `200 OK`
```json
{
  "message": "Term deleted successfully"
}
```

---

## Generic Module Endpoints

All appraisal modules follow the same pattern. Replace `{module}` with the specific endpoint.

### Module Endpoints List

- `fci-scores`
- `journal-papers`
- `conference-papers`
- `non-indexed-publications`
- `books`
- `disclosures`
- `patents`
- `ug-guidance`
- `masters-guidance`
- `phd-guidance`
- `funded-projects`
- `consulting-projects`
- `reviewer-roles`
- `fdp-organized`
- `invited-talks`
- `events-outside`
- `events-inside`
- `industry-relations`
- `institutional-services`
- `other-services`
- `awards`
- `professionalism`
- `other-contributions`

### Get All Records

**GET** `/{module}?termId={termId}` 🔒

Get all records for a specific term (optional).

**Query Parameters:**
- `termId` (optional): Filter by term ID

**Response:** `200 OK`
```json
[
  {
    "_id": "64ghi789...",
    "facultyId": "64abc123...",
    "termId": "64def456...",
    // Module-specific fields
    "createdAt": "2024-06-01T10:00:00.000Z",
    "updatedAt": "2024-06-01T10:00:00.000Z"
  }
]
```

### Get Single Record

**GET** `/{module}/:id` 🔒

Get a specific record by ID.

**Response:** `200 OK`

### Create Record

**POST** `/{module}` 🔒

Create a new record.

**Request Body:** Module-specific fields (see below)

**Response:** `201 Created`

### Update Record

**PUT** `/{module}/:id` 🔒

Update an existing record.

**Request Body:** Module-specific fields

**Response:** `200 OK`

### Delete Record

**DELETE** `/{module}/:id` 🔒

Delete a record.

**Response:** `200 OK`
```json
{
  "message": "{Module} deleted successfully"
}
```

---

## Module-Specific Schemas

### FCI Score
```json
{
  "termId": "64def456...",
  "averageScore": 8.5,
  "numberOfCourses": 3,
  "remarks": "Good feedback from students"
}
```

### Journal Paper
```json
{
  "termId": "64def456...",
  "title": "Machine Learning in Healthcare",
  "journalName": "IEEE Transactions on Medical Imaging",
  "indexedIn": "Scopus",
  "authorPosition": 1,
  "publicationDate": "2024-05-15",
  "doi": "10.1109/TMI.2024.1234567"
}
```

### Conference Paper
```json
{
  "termId": "64def456...",
  "title": "Deep Learning for Image Recognition",
  "conferenceName": "IEEE CVPR 2024",
  "authorPosition": 2,
  "publicationDate": "2024-06-20"
}
```

### Non-Indexed Publication
```json
{
  "termId": "64def456...",
  "title": "Survey on AI Applications",
  "type": "Journal",
  "authorPosition": 1,
  "publicationDate": "2024-04-10"
}
```

### Book / Book Chapter
```json
{
  "termId": "64def456...",
  "type": "Chapter",
  "title": "Introduction to Neural Networks",
  "authorPosition": 1,
  "publisher": "Springer",
  "publicationYear": 2024,
  "isbn": "978-3-16-148410-0"
}
```

### Disclosure
```json
{
  "termId": "64def456...",
  "title": "AI-based Medical Diagnosis System",
  "filingDate": "2024-03-15",
  "applicationNumber": "202441012345"
}
```

### Patent
```json
{
  "termId": "64def456...",
  "title": "Smart Healthcare Monitoring Device",
  "grantDate": "2024-05-20",
  "patentNumber": "US10123456B2"
}
```

### UG Guidance
```json
{
  "termId": "64def456...",
  "numberOfStudents": 5,
  "projectTitle": "IoT-based Smart Home System",
  "remarks": "Final year project"
}
```

### Master's Guidance
```json
{
  "termId": "64def456...",
  "numberOfStudents": 2,
  "thesisTitle": "Blockchain in Supply Chain",
  "remarks": "Thesis submitted"
}
```

### PhD Guidance
```json
{
  "termId": "64def456...",
  "numberOfScholars": 3,
  "scholarName": "Jane Smith",
  "researchArea": "Computer Vision",
  "status": "Ongoing"
}
```

### Funded Project
```json
{
  "termId": "64def456...",
  "title": "AI for Agriculture",
  "fundingAmount": 1500000,
  "category": "5-10 Lakhs",
  "fundingAgency": "DST",
  "startDate": "2024-01-01",
  "endDate": "2025-12-31"
}
```

### Consulting Project
```json
{
  "termId": "64def456...",
  "title": "Data Analytics for Retail",
  "amount": 500000,
  "clientName": "ABC Corporation",
  "completionDate": "2024-08-30"
}
```

### Reviewer Role
```json
{
  "termId": "64def456...",
  "roleType": "Reviewer",
  "isQ1Q2Reviewer": true,
  "venueName": "IEEE Transactions on AI",
  "year": 2024
}
```

### FDP Organized
```json
{
  "termId": "64def456...",
  "eventTitle": "Workshop on Machine Learning",
  "durationCategory": "5 Days",
  "startDate": "2024-07-01",
  "endDate": "2024-07-05"
}
```

### Invited Talk
```json
{
  "termId": "64def456...",
  "title": "Future of AI in Education",
  "organization": "XYZ University",
  "date": "2024-06-15"
}
```

### Event Outside
```json
{
  "termId": "64def456...",
  "type": "Conference",
  "eventName": "International AI Summit 2024",
  "organization": "IEEE",
  "date": "2024-05-10"
}
```

### Event Inside
```json
{
  "termId": "64def456...",
  "type": "Workshop",
  "eventName": "Faculty Development Program",
  "date": "2024-04-20"
}
```

### Industry Relation
```json
{
  "termId": "64def456...",
  "type": "MoU",
  "companyName": "Tech Corp",
  "description": "Collaboration for research and internships",
  "date": "2024-03-01"
}
```

### Institutional Service
```json
{
  "termId": "64def456...",
  "role": "Coordinator",
  "serviceName": "NBA Accreditation",
  "description": "Coordinated NBA documentation"
}
```

### Other Service
```json
{
  "termId": "64def456...",
  "description": "Organized blood donation camp",
  "date": "2024-02-14"
}
```

### Award
```json
{
  "termId": "64def456...",
  "title": "Best Teacher Award",
  "issuingBody": "University",
  "date": "2024-01-26"
}
```

### Professionalism
```json
{
  "termId": "64def456...",
  "rating": 5,
  "remarks": "Excellent team collaboration"
}
```

### Other Contribution
```json
{
  "termId": "64def456...",
  "description": "Developed online learning platform for department (max 500 characters)"
}
```

---

## Report Generation

### Generate PDF Report

**GET** `/report/:termId` 🔒

Generate a comprehensive PDF appraisal report for a specific term.

**Parameters:**
- `termId`: Term ID for which to generate report

**Response:** `200 OK`
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename=appraisal-report-{termName}.pdf`

**Example:**
```bash
curl -X GET http://localhost:5000/api/report/64def456... \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output report.pdf
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to access this record"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error message",
  "error": "Detailed error (development only)"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding rate limiting middleware.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

## Notes

- All dates should be in ISO 8601 format
- All protected endpoints (🔒) require JWT authentication
- Faculty can only access their own data
- Timestamps (createdAt, updatedAt) are automatically managed by Mongoose

---

**API Version:** 1.0.0
**Last Updated:** 2024
