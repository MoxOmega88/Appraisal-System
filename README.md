# Faculty Appraisal Management System

A comprehensive full-stack MERN (MongoDB, Express, React, Node.js) application for managing faculty appraisal records in academic institutions. This system allows faculty members to continuously log academic, research, and institutional activities during a term and generate structured term-wise appraisal reports.

## 🎯 Features

### Core Functionality
- **JWT Authentication** - Secure faculty login and registration
- **Term-based Management** - Organize activities by academic terms
- **23 Appraisal Modules** - Complete coverage of faculty activities
- **PDF Report Generation** - Comprehensive term-wise appraisal reports
- **Professional UI** - Formal academic theme with Material-UI

### Appraisal Modules

1. **FCI Score** - Faculty Course Interaction scores
2. **Refereed Journal Papers** - SJR/Scopus/WoS indexed publications
3. **Indexed Conference Papers** - SJR/Scopus/WoS indexed conferences
4. **Non-Indexed Publications** - Non-refereed journals and conferences
5. **Books / Book Chapters** - Published books and chapters
6. **Disclosures Filed** - Patent disclosures
7. **Patents Granted** - Granted patents
8. **UG Research Guidance** - Undergraduate project guidance
9. **Master's Research Guidance** - Master's thesis guidance
10. **PhD Research Guidance** - Doctoral research guidance
11. **Funded Projects** - Research projects with funding
12. **Consulting Projects** - Industry consulting work
13. **Reviewer Roles** - Conference/journal reviewing
14. **FDP/Events Organized** - Events organized as coordinator
15. **Invited Talks** - Technical talks outside institute
16. **Events Outside** - Participation in external events
17. **Events Inside** - Participation in internal events
18. **Industry Relations** - MoUs, collaborations
19. **Institutional Services** - NBA, NIRF coordination
20. **Other Services** - Additional institutional services
21. **Awards & Honours** - Recognition received
22. **Professionalism** - Team spirit rating
23. **Other Contributions** - Additional major contributions

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **PDFKit** - PDF generation
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## 📁 Project Structure

```
faculty-appraisal-system/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── genericController.js
│   │   ├── reportController.js
│   │   └── termController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Term.js
│   │   ├── FCIScore.js
│   │   ├── JournalPaper.js
│   │   ├── ConferencePaper.js
│   │   ├── NonIndexedPublication.js
│   │   ├── Book.js
│   │   ├── Disclosure.js
│   │   ├── Patent.js
│   │   ├── UGGuidance.js
│   │   ├── MastersGuidance.js
│   │   ├── PhDGuidance.js
│   │   ├── FundedProject.js
│   │   ├── ConsultingProject.js
│   │   ├── ReviewerRole.js
│   │   ├── FDPOrganized.js
│   │   ├── InvitedTalk.js
│   │   ├── EventOutside.js
│   │   ├── EventInside.js
│   │   ├── IndustryRelation.js
│   │   ├── InstitutionalService.js
│   │   ├── OtherService.js
│   │   ├── Award.js
│   │   ├── Professionalism.js
│   │   └── OtherContribution.js
│   ├── routes/
│   │   └── [All route files]
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   └── GenericCRUDPage.js
│   │   ├── context/
│   │   │   └── authContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── TermManagement.js
│   │   │   └── [All module pages]
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
copy .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/faculty-appraisal
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

5. Start MongoDB service

6. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📝 Usage

### First Time Setup

1. **Register**: Create a faculty account with your details
   - Name, Email, Password
   - Employee ID, Department, Designation
   - Joining Date

2. **Login**: Sign in with your credentials

3. **Create Term**: Set up an appraisal term
   - Term Name (e.g., "Monsoon 2024")
   - Academic Year (e.g., "2024-2025")
   - Start Date, End Date, Duration

4. **Add Records**: Navigate through sidebar to add activities
   - Select the term
   - Add records for each module
   - Edit or delete as needed

5. **Generate Report**: From dashboard
   - Select term
   - Click "Generate PDF Report"
   - Download comprehensive appraisal report

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new faculty
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (Protected)

### Terms
- `GET /api/terms` - Get all terms (Protected)
- `POST /api/terms` - Create term (Protected)
- `PUT /api/terms/:id` - Update term (Protected)
- `DELETE /api/terms/:id` - Delete term (Protected)

### Appraisal Modules (All Protected)
Each module follows the same pattern:
- `GET /api/[module]?termId=xyz` - Get all records
- `POST /api/[module]` - Create record
- `PUT /api/[module]/:id` - Update record
- `DELETE /api/[module]/:id` - Delete record

Module endpoints:
- `/api/fci-scores`
- `/api/journal-papers`
- `/api/conference-papers`
- `/api/non-indexed-publications`
- `/api/books`
- `/api/disclosures`
- `/api/patents`
- `/api/ug-guidance`
- `/api/masters-guidance`
- `/api/phd-guidance`
- `/api/funded-projects`
- `/api/consulting-projects`
- `/api/reviewer-roles`
- `/api/fdp-organized`
- `/api/invited-talks`
- `/api/events-outside`
- `/api/events-inside`
- `/api/industry-relations`
- `/api/institutional-services`
- `/api/other-services`
- `/api/awards`
- `/api/professionalism`
- `/api/other-contributions`

### Reports
- `GET /api/report/:termId` - Generate PDF report (Protected)

## 🎨 UI Features

- **Professional Academic Theme** - Formal university-style design
- **Responsive Layout** - Works on desktop and mobile
- **Sidebar Navigation** - Easy access to all modules
- **Data Tables** - Sortable, searchable tables
- **Form Validation** - Client and server-side validation
- **Success/Error Messages** - Clear user feedback
- **Term Selection** - Filter data by academic term

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- User ownership verification
- Input validation
- CORS configuration

## 📊 Database Schema

All models include:
- `facultyId` - Reference to User
- `termId` - Reference to Term
- Module-specific fields
- Timestamps (createdAt, updatedAt)

## 🤝 Contributing

This is an academic project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - Feel free to use for educational purposes

## 👥 Support

For issues or questions:
- Check existing documentation
- Review error messages in console
- Verify MongoDB connection
- Ensure all dependencies are installed

## 🎓 Academic Note

This system is designed as an academic project for faculty appraisal management. It demonstrates:
- Full-stack MERN development
- RESTful API design
- JWT authentication
- CRUD operations
- PDF generation
- Professional UI/UX design

---

**Built with ❤️ for Academic Excellence**
