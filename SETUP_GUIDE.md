# Quick Setup Guide

## Step-by-Step Installation

### 1. Install MongoDB

**Windows:**
- Download MongoDB Community Server from https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Default connection: `mongodb://localhost:27017`

**Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your settings
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/faculty-appraisal
# JWT_SECRET=your_very_secure_secret_key_change_this
# JWT_EXPIRE=30d
# NODE_ENV=development

# Start the server
npm start

# OR for development with auto-reload
npm run dev
```

Backend will run on: http://localhost:5000

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will open automatically at: http://localhost:3000

### 4. First Use

1. **Register a Faculty Account**
   - Go to http://localhost:3000/register
   - Fill in all required fields
   - Click Register

2. **Login**
   - Use your email and password
   - You'll be redirected to the dashboard

3. **Create Your First Term**
   - Click "Term Management" in sidebar
   - Click "Create New Term"
   - Fill in term details:
     - Term Name: e.g., "Monsoon 2024"
     - Academic Year: e.g., "2024-2025"
     - Start Date: Select date
     - End Date: Select date
     - Duration: e.g., 6 months
   - Click Create

4. **Add Appraisal Records**
   - Navigate to any module from sidebar
   - Select your term from dropdown
   - Click "Add New Record"
   - Fill in the form
   - Click Create

5. **Generate Report**
   - Go to Dashboard
   - Select term
   - Click "Generate PDF Report"
   - PDF will download automatically

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in backend/.env to another port (e.g., 5001)

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:** Install dependencies
```bash
cd backend
npm install
```

### CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Make sure backend is running and proxy is set in frontend/package.json

### JWT Secret Warning
**Solution:** Change JWT_SECRET in .env to a strong random string

## Testing the API

You can test the API using tools like Postman or curl:

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Doe",
    "email": "john.doe@university.edu",
    "password": "password123",
    "employeeId": "EMP001",
    "department": "Computer Science",
    "designation": "Associate Professor",
    "joiningDate": "2020-01-15"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@university.edu",
    "password": "password123"
  }'
```

### Get Terms (with token)
```bash
curl -X GET http://localhost:5000/api/terms \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Production Deployment

### Backend (Node.js)

1. Set environment variables:
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=very_secure_random_string
```

2. Install dependencies:
```bash
npm install --production
```

3. Start server:
```bash
npm start
```

### Frontend (React)

1. Build for production:
```bash
cd frontend
npm run build
```

2. Serve the build folder using:
   - Nginx
   - Apache
   - Node.js static server
   - Vercel/Netlify

### Recommended Hosting

- **Backend:** Heroku, Railway, Render, DigitalOcean
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Database:** MongoDB Atlas (free tier available)

## MongoDB Atlas Setup (Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Create database user
5. Whitelist IP address (0.0.0.0/0 for development)
6. Get connection string
7. Update MONGODB_URI in .env:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/faculty-appraisal
```

## Common Commands

### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## Default Credentials

After registration, you can create test data:

**Sample Faculty:**
- Name: Dr. Jane Smith
- Email: jane.smith@university.edu
- Password: Test@123
- Employee ID: FAC001
- Department: Computer Science
- Designation: Professor

## Need Help?

1. Check console for error messages
2. Verify all services are running
3. Check MongoDB connection
4. Ensure ports are not blocked
5. Review the README.md for detailed documentation

---

**Happy Coding! 🎓**
