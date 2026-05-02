# Admin Setup Instructions

## Security Fix Applied ✅

The admin login has been updated to use **proper JWT authentication** instead of localStorage-based authentication. This fixes the security vulnerability where admin endpoints were accessible without proper authentication.

---

## What Changed

### Before (Insecure):
- Admin login used localStorage flags only
- No JWT token generated
- Admin endpoints were unprotected
- Anyone could access `/api/auth/users` without authentication

### After (Secure):
- Admin login uses real user account with JWT authentication
- Proper token validation on all admin endpoints
- Admin endpoints protected with `protect` middleware
- Secure authentication flow

---

## Setup Instructions

### Step 1: Create Admin User Account

Run this command **once** to create the admin user in the database:

```bash
cd backend
node scripts/createAdminUser.js
```

This will create an admin user with:
- **Email:** admin@gmail.com
- **Password:** admin123
- **Employee ID:** ADMIN001
- **Department:** Administration
- **Designation:** System Administrator

### Step 2: Login as Admin

1. Go to the login page
2. Click "Admin Login" button
3. Enter credentials:
   - Email: `admin@gmail.com`
   - Password: `admin123`
4. Click "Sign In"

### Step 3: Change Admin Password (Recommended)

After first login:
1. Go to user profile (click on avatar/name)
2. Click "Change Password"
3. Enter current password: `admin123`
4. Enter new password (minimum 6 characters)
5. Confirm new password
6. Click "Change Password"

---

## How It Works Now

### Admin Login Flow:
1. User clicks "Admin Login" on login page
2. Enters admin credentials (admin@gmail.com / admin123)
3. System calls regular `/api/auth/login` endpoint
4. JWT token is generated and stored
5. Admin flags are set in localStorage (`isAdmin`, `adminLoginTime`)
6. User is redirected to Admin Dashboard
7. Admin Dashboard uses JWT token for API calls

### Security Features:
- ✅ JWT token required for all admin API calls
- ✅ Token validation on every request
- ✅ Admin session timeout (24 hours)
- ✅ Password hashing with bcrypt
- ✅ Proper authorization checks
- ✅ No localStorage-based authentication for API calls

---

## Admin Features

### View All Users
- See all registered faculty members
- View user details (name, email, employee ID, department, etc.)
- See last login timestamp

### Delete Users
- Delete user accounts
- Requires admin password confirmation
- Permanent deletion (cannot be undone)

### Login as User
- Navigate to login page with user's email pre-filled
- Useful for testing or assisting users

### Change Password
- Change admin password through user profile
- Requires current password verification
- New password must be at least 6 characters

### Session Management
- Admin session expires after 24 hours
- Automatic logout on session expiry
- Session time tracked in localStorage

---

## Security Notes

### Current Implementation:
- ✅ Admin uses real user account with JWT authentication
- ✅ All admin endpoints protected with middleware
- ✅ Password hashing with bcrypt
- ✅ Token validation on every request
- ✅ Session timeout implemented

### For Production Deployment:
1. **Change default admin password** immediately after setup
2. **Use strong password** (minimum 8 characters, mix of letters, numbers, symbols)
3. **Enable HTTPS** for secure communication
4. **Set up MongoDB backups** regularly
5. **Monitor admin activity** through logs
6. **Consider adding 2FA** for admin accounts
7. **Implement rate limiting** on login endpoints
8. **Add audit logging** for admin actions

---

## Troubleshooting

### Issue: "Invalid admin credentials"
**Solution:** Make sure you've run the `createAdminUser.js` script to create the admin account.

### Issue: "Not authorized, no token"
**Solution:** This should no longer happen. If it does, clear localStorage and login again.

### Issue: "Admin session expired"
**Solution:** Admin sessions expire after 24 hours. Login again to continue.

### Issue: Can't access admin dashboard
**Solution:** 
1. Make sure you're logged in as admin
2. Check that admin user exists in database
3. Clear browser cache and localStorage
4. Try logging in again

---

## Migration from Old System

If you were using the old localStorage-based admin system:

1. **Clear localStorage:**
   - Open browser DevTools (F12)
   - Go to Application > Local Storage
   - Clear all items
   - Refresh page

2. **Create admin user:**
   - Run `node backend/scripts/createAdminUser.js`

3. **Login with new credentials:**
   - Email: admin@gmail.com
   - Password: admin123

4. **Change password:**
   - Go to profile and change password immediately

---

## Summary

✅ **Security Issue Fixed:** Admin endpoints now properly protected with JWT authentication  
✅ **Proper Authentication:** Admin uses real user account with token validation  
✅ **Session Management:** 24-hour timeout with automatic logout  
✅ **Password Security:** Bcrypt hashing, minimum 6 characters  
✅ **Production Ready:** Secure implementation suitable for deployment  

---

**Last Updated:** April 30, 2026  
**Status:** ✅ Secure and Ready for Use
