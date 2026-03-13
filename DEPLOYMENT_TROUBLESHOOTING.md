# Deployment Troubleshooting Guide

## 404 Error on Signup/Register - Common Issues

### Issue: Frontend can't reach backend API (404 error)

## Quick Checklist

### 1. Check if Backend is Running
```bash
# In the backend folder
cd backend
npm start
```

**Expected output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
```

If you see errors:
- **MongoDB connection error**: Update `MONGODB_URI` in `backend/.env`
- **Port already in use**: Change `PORT` in `backend/.env` or kill the process using port 5000

### 2. Check if Frontend is Running
```bash
# In the frontend folder (separate terminal)
cd frontend
npm start
```

**Expected output:**
```
Compiled successfully!
Local: http://localhost:3000
```

### 3. Verify Environment Configuration

#### Backend Setup (`backend/.env`)
Create this file if it doesn't exist:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

**Important:** Replace `your_mongodb_connection_string` with your actual MongoDB URI

#### Frontend Proxy Configuration
The `frontend/package.json` already has:
```json
"proxy": "http://localhost:5000"
```

This tells the frontend to forward API requests to the backend.

### 4. Test Backend Directly

Open browser or use curl:
```bash
# Test if backend is responding
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"Faculty Appraisal System API is running"}
```

### 5. Common Issues and Solutions

#### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Check your MongoDB URI in `backend/.env`
- For MongoDB Atlas: Whitelist your IP address
- For local MongoDB: Ensure MongoDB service is running

#### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

Or change the port in `backend/.env`:
```env
PORT=5001
```

And update `frontend/package.json`:
```json
"proxy": "http://localhost:5001"
```

#### Issue: "CORS error"
**Solution:** The backend already has CORS enabled. If you still see CORS errors:
- Make sure both frontend and backend are running
- Clear browser cache
- Try in incognito mode

#### Issue: "Module not found"
**Solution:**
```bash
# In backend folder
cd backend
npm install

# In frontend folder
cd frontend
npm install
```

## Step-by-Step Setup for New System

### 1. Clone the Repository
```bash
git clone https://github.com/MoxOmega88/Appraisal-System.git
cd Appraisal-System
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/faculty-appraisal
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

Start backend:
```bash
npm start
```

### 3. Setup Frontend (New Terminal)
```bash
cd frontend
npm install
npm start
```

### 4. Access the Application
Open browser: `http://localhost:3000`

## Network Console Debugging

If you see 404 in network console:

1. **Check Request URL**: Should be like `http://localhost:3000/api/auth/register`
2. **Check Request Method**: Should be POST for register
3. **Check if backend is running**: Look for backend terminal output
4. **Check backend logs**: Any errors in backend terminal?

## Testing the Setup

### Test 1: Backend Health Check
```bash
curl http://localhost:5000/api/health
```

### Test 2: Register a User (using curl)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "employeeId": "EMP001",
    "department": "Computer Science",
    "designation": "Assistant Professor"
  }'
```

### Test 3: Frontend to Backend
1. Open browser console (F12)
2. Go to Network tab
3. Try to register
4. Check the request details

## Still Having Issues?

Check these files:
- `backend/server.js` - Backend entry point
- `backend/routes/authRoutes.js` - Auth routes
- `frontend/src/services/api.js` - API configuration
- Backend terminal for error messages
- Frontend browser console for errors

## Quick Fix Commands

```bash
# Kill all node processes (if ports are stuck)
# Windows
taskkill /F /IM node.exe

# Linux/Mac
killall node

# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install

# Clear npm cache
npm cache clean --force
```
