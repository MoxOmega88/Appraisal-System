# Testing Checklist

## Pre-Testing Setup

- [ ] MongoDB is installed and running
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Backend .env file configured
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000

## Authentication Tests

### Registration
- [ ] Navigate to `/register`
- [ ] Fill all required fields
- [ ] Submit form
- [ ] Verify successful registration
- [ ] Check redirect to dashboard
- [ ] Verify token stored in localStorage

### Login
- [ ] Navigate to `/login`
- [ ] Enter valid credentials
- [ ] Submit form
- [ ] Verify successful login
- [ ] Check redirect to dashboard
- [ ] Test invalid credentials (should show error)

### Logout
- [ ] Click user avatar
- [ ] Click logout
- [ ] Verify redirect to login page
- [ ] Verify token removed from localStorage

## Term Management Tests

- [ ] Navigate to "Term Management"
- [ ] Click "Create New Term"
- [ ] Fill in term details:
  - Term Name: "Test Term 2024"
  - Academic Year: "2024-2025"
  - Start Date: Select date
  - End Date: Select date (after start date)
  - Duration: 6 months
- [ ] Submit form
- [ ] Verify term appears in table
- [ ] Click Edit icon
- [ ] Modify term name
- [ ] Save changes
- [ ] Verify changes reflected
- [ ] Test Delete (create another term first)

## Module Testing (Test each module)

### 1. FCI Score
- [ ] Navigate to "FCI Scores"
- [ ] Select term
- [ ] Click "Add New Record"
- [ ] Fill form:
  - Average Score: 8.5
  - Number of Courses: 3
  - Remarks: "Good feedback"
- [ ] Submit and verify in table
- [ ] Test Edit functionality
- [ ] Test Delete functionality

### 2. Journal Papers
- [ ] Navigate to "Journal Papers"
- [ ] Select term
- [ ] Add new record:
  - Title: "Test Paper on AI"
  - Journal Name: "IEEE Transactions"
  - Indexed In: "Scopus"
  - Author Position: 1
  - Publication Date: Select date
  - DOI: "10.1234/test"
- [ ] Verify record created
- [ ] Test Edit and Delete

### 3. Conference Papers
- [ ] Navigate to "Conference Papers"
- [ ] Add record with all fields
- [ ] Verify CRUD operations

### 4. Non-Indexed Publications
- [ ] Navigate to "Non-Indexed Publications"
- [ ] Test both Journal and Conference types
- [ ] Verify CRUD operations

### 5. Books / Book Chapters
- [ ] Navigate to "Books & Chapters"
- [ ] Test both Book and Chapter types
- [ ] Verify author position validation (1-3)
- [ ] Test CRUD operations

### 6. Disclosures
- [ ] Navigate to "Disclosures"
- [ ] Add disclosure with filing date
- [ ] Verify CRUD operations

### 7. Patents
- [ ] Navigate to "Patents"
- [ ] Add patent with grant date
- [ ] Verify CRUD operations

### 8-10. Research Guidance
- [ ] Navigate to "Research Guidance"
- [ ] Test UG tab:
  - Add students count
  - Add project title
- [ ] Test Master's tab:
  - Add students count
  - Add thesis title
- [ ] Test PhD tab:
  - Add scholars count
  - Add scholar name
  - Select status
- [ ] Verify all CRUD operations

### 11-12. Projects
- [ ] Navigate to "Projects"
- [ ] Test Funded Projects tab:
  - Add project with funding amount
  - Select category
  - Add funding agency
- [ ] Test Consulting Projects tab:
  - Add project with amount
  - Add client name
- [ ] Verify CRUD operations

### 13-15. Professional Activities
- [ ] Navigate to "Professional Activities"
- [ ] Test Reviewer Roles tab:
  - Add reviewer role
  - Test Q1/Q2 checkbox
- [ ] Test Events Organized tab:
  - Add FDP/Workshop
  - Select duration category
- [ ] Test Invited Talks tab:
  - Add talk details
- [ ] Verify CRUD operations

### 16-17. Events
- [ ] Navigate to "Events"
- [ ] Test Outside Institute tab:
  - Add event with organization
  - Test all event types
- [ ] Test Inside Institute tab:
  - Add internal event
- [ ] Verify CRUD operations

### 18-20. Services
- [ ] Navigate to "Services"
- [ ] Test Industry Relations tab:
  - Add MoU/Event
  - Add company name
- [ ] Test Institutional Services tab:
  - Add NBA/NIRF service
  - Select role
- [ ] Test Other Services tab:
  - Add service description
- [ ] Verify CRUD operations

### 21-23. Awards & Recognition
- [ ] Navigate to "Awards & Others"
- [ ] Test Awards tab:
  - Add award with issuing body
- [ ] Test Professionalism tab:
  - Add rating (1-5)
  - Add remarks
- [ ] Test Other Contributions tab:
  - Add contribution (max 500 chars)
- [ ] Verify CRUD operations

## Dashboard Tests

- [ ] Navigate to Dashboard
- [ ] Verify welcome message shows user name
- [ ] Select term from dropdown
- [ ] Verify statistics cards update:
  - Journal Papers count
  - Conference Papers count
  - PhD Scholars count
  - Funded Projects count
  - Awards count
- [ ] Verify counts match actual records

## Report Generation Tests

- [ ] Go to Dashboard
- [ ] Select a term with data
- [ ] Click "Generate PDF Report"
- [ ] Verify PDF downloads
- [ ] Open PDF and check:
  - [ ] Header with faculty details
  - [ ] Term information
  - [ ] All 23 modules listed
  - [ ] Data appears correctly
  - [ ] Formatting is professional

## UI/UX Tests

### Navigation
- [ ] Test sidebar navigation
- [ ] Verify all menu items work
- [ ] Test mobile responsive menu
- [ ] Verify active route highlighting

### Forms
- [ ] Test required field validation
- [ ] Test date field validation
- [ ] Test number field validation (min/max)
- [ ] Test select dropdown functionality
- [ ] Test multiline text areas
- [ ] Test form reset on cancel

### Tables
- [ ] Verify data displays correctly
- [ ] Test Edit button functionality
- [ ] Test Delete button functionality
- [ ] Verify delete confirmation dialog
- [ ] Test empty state message

### Alerts
- [ ] Verify success messages appear
- [ ] Verify error messages appear
- [ ] Test alert close functionality
- [ ] Verify alerts auto-dismiss

### Term Selection
- [ ] Test term dropdown in each module
- [ ] Verify data filters by selected term
- [ ] Test with multiple terms
- [ ] Verify "Add New Record" disabled without term

## Error Handling Tests

### Backend Errors
- [ ] Stop backend server
- [ ] Try to login (should show error)
- [ ] Try to fetch data (should show error)
- [ ] Restart backend and verify recovery

### Invalid Data
- [ ] Try to submit form with missing required fields
- [ ] Try to enter invalid email format
- [ ] Try to enter negative numbers where not allowed
- [ ] Try to enter dates in wrong order
- [ ] Verify validation messages

### Authentication Errors
- [ ] Try to access protected route without login
- [ ] Verify redirect to login page
- [ ] Try to access another user's data (should fail)
- [ ] Test expired token handling

## Performance Tests

- [ ] Add 50+ records to a module
- [ ] Verify table loads quickly
- [ ] Test pagination if implemented
- [ ] Test search/filter if implemented
- [ ] Generate report with large dataset

## Browser Compatibility

- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Test on mobile browsers

## Security Tests

- [ ] Verify passwords are hashed in database
- [ ] Verify JWT tokens are used
- [ ] Verify protected routes require authentication
- [ ] Verify users can only access their own data
- [ ] Test CORS configuration

## Database Tests

- [ ] Open MongoDB Compass or mongo shell
- [ ] Verify collections are created:
  - users
  - terms
  - fciscores
  - journalpapers
  - conferencepapers
  - (all 23 modules)
- [ ] Verify data structure matches models
- [ ] Verify indexes are created
- [ ] Check facultyId and termId references

## Final Checks

- [ ] All 23 modules working
- [ ] All CRUD operations functional
- [ ] PDF generation working
- [ ] Authentication working
- [ ] No console errors
- [ ] No console warnings
- [ ] Professional UI appearance
- [ ] Responsive design working
- [ ] All forms validated
- [ ] All error messages clear

## Known Issues to Document

List any issues found during testing:

1. 
2. 
3. 

## Test Results Summary

- Total Tests: ___
- Passed: ___
- Failed: ___
- Blocked: ___

---

**Testing Date:** ___________
**Tested By:** ___________
**Environment:** Development / Production
**Browser:** ___________
**OS:** ___________
