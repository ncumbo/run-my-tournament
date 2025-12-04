# Admin System Documentation

This document outlines the comprehensive admin functionality added to the IBM Charity Golf Tournament website.

## Overview

A complete admin authentication and content management system has been implemented, allowing authorized users to log in and manage tournament content through a dedicated dashboard.

## Admin Features Implemented

### 1. Authentication System (`src/lib/stores/auth.ts`)

- **Mock Authentication**: Simple localStorage-based authentication for demonstration
- **User Management**: Support for admin users with role-based access
- **Session Persistence**: Admin sessions persist across browser sessions
- **Demo Credentials**:
  - Email: `admin@ibm.com`
  - Password: `admin123`

### 2. Admin Login (`/admin/login`)

- **Location**: `src/routes/admin/login/+page.svelte`
- **Features**:
  - Clean, professional login form using reusable components
  - Form validation with error handling
  - Demo credentials display for easy testing
  - Responsive design matching site theme
  - Redirect to dashboard on successful login

### 3. Admin Registration (`/admin/register`)

- **Location**: `src/routes/admin/register/+page.svelte`
- **Features**:
  - Registration form for new admin accounts
  - Password confirmation validation
  - Success state with automatic redirect
  - Security notices and admin benefit overview
  - Links to login for existing users

### 4. Admin Dashboard (`/admin/dashboard`)

- **Location**: `src/routes/admin/dashboard/+page.svelte`
- **Features**:
  - **Overview Section**: Tournament statistics and key information
  - **Content Editing**: Live editing of tournament information
  - **Registration Management**: View and manage participant registrations
  - **Settings Panel**: Placeholder for system configuration
  - **Route Protection**: Automatic redirect if not authenticated

## Admin Dashboard Sections

### 📊 Overview

- Tournament details display
- Pricing and goals summary
- Key statistics (registrations, revenue, days until tournament)
- Quick access to important information

### ✏️ Edit Content

- **Tournament Information Editing**:
  - Tournament title and date
  - Start time and charity supported
  - Tournament format and fundraising goals
  - Individual and foursome pricing
  - Registration deadline
- **Real-time Preview**: See current settings before editing
- **Form Validation**: Ensure data integrity
- **Save Confirmation**: Success feedback on updates

### 👥 Registrations

- **Registration Table**: View all tournament registrations
- **Participant Details**: Name, email, registration type, amount, status
- **Status Management**: Track confirmed vs pending registrations
- **Responsive Design**: Mobile-friendly table layout

### ⚙️ Settings

- **System Configuration**: Placeholder for future features
- **Planned Features**:
  - Email notification settings
  - Payment gateway configuration
  - User permission management
  - Data export/import tools

## Navigation Integration

### Admin Access in Main Navigation

- **Dynamic Menu Item**: Shows "🔐 Admin" in main navigation
- **Conditional Display**:
  - Shows "Admin Dashboard" link if logged in as admin
  - Shows "Admin Login" link if not authenticated
- **Visual Styling**: Special styling to distinguish admin access

## Technical Implementation

### Components Used

All admin pages leverage the reusable component library:

- **PageHero**: Consistent page headers
- **Form**: Standardized form containers with success states
- **Input**: Comprehensive form inputs with validation
- **Button**: Consistent button styling and behavior
- **Card**: Information display and layout containers

### Authentication Flow

1. User navigates to `/admin/login`
2. Enters credentials (demo: admin@ibm.com / admin123)
3. System validates credentials against mock user database
4. On success, user data stored in localStorage
5. User redirected to `/admin/dashboard`
6. Dashboard checks authentication on load
7. Admin navigation item updates to show dashboard link

### Route Protection

- Dashboard automatically redirects unauthenticated users to login
- Navigation dynamically updates based on auth status
- Session persistence across browser tabs and refreshes

## Security Considerations

### Current Implementation (Demo)

- **localStorage Authentication**: Simple for demonstration
- **Mock User Database**: Hardcoded users for testing
- **Client-side Validation**: Basic form validation

### Production Recommendations

- **Backend Authentication**: Implement proper server-side auth
- **JWT Tokens**: Use secure token-based authentication
- **HTTPS Only**: Enforce secure connections
- **Session Management**: Implement proper session handling
- **Role-based Access**: Expand role system beyond admin/user
- **Audit Logging**: Track admin actions and changes

## Admin Capabilities

### Current Features

✅ **User Authentication**: Login/logout functionality
✅ **Tournament Info Editing**: Update core tournament details
✅ **Registration Viewing**: See all participant registrations
✅ **Dashboard Overview**: Key statistics and information
✅ **Responsive Design**: Mobile-friendly admin interface
✅ **Form Validation**: Ensure data integrity
✅ **Success Feedback**: Confirmation of actions

### Future Enhancements

🔄 **Registration Management**: Approve/reject registrations
🔄 **Email Communication**: Send updates to participants
🔄 **Financial Reporting**: Detailed revenue analytics
🔄 **Content Publishing**: Edit public page content
🔄 **User Management**: Manage other admin accounts
🔄 **Backup/Restore**: Data management tools
🔄 **Audit Trails**: Track all admin actions

## Usage Instructions

### For Developers

1. **Access Admin Area**: Navigate to `/admin/login`
2. **Demo Login**: Use admin@ibm.com / admin123
3. **Explore Dashboard**: Test all sections and functionality
4. **Edit Content**: Try updating tournament information
5. **Test Authentication**: Logout and login again

### For End Users

1. **Admin Access**: Request admin credentials from system administrator
2. **Login Process**: Use provided email and password
3. **Dashboard Navigation**: Use section tabs to access different areas
4. **Content Editing**: Click "Start Editing" to modify tournament info
5. **Save Changes**: Always save after making edits
6. **Logout**: Use logout button in dashboard header

## Files Created/Modified

### New Admin Files

- `src/lib/stores/auth.ts` - Authentication store and logic
- `src/routes/admin/login/+page.svelte` - Admin login page
- `src/routes/admin/register/+page.svelte` - Admin registration page
- `src/routes/admin/dashboard/+page.svelte` - Main admin dashboard

### Modified Files

- `src/routes/+layout.svelte` - Added admin navigation link
- `src/lib/components/index.ts` - Component exports (if needed)

## Testing the Admin System

### Quick Test Steps

1. **Start Development Server**: `npm run dev`
2. **Navigate to Login**: Visit `http://localhost:5173/admin/login`
3. **Login with Demo Credentials**: admin@ibm.com / admin123
4. **Explore Dashboard**: Test all four sections
5. **Edit Tournament Info**: Try updating and saving changes
6. **Test Authentication**: Logout and verify redirect
7. **Check Navigation**: Confirm admin link appears in main nav

### Test Scenarios

- ✅ Valid login redirects to dashboard
- ✅ Invalid login shows error message
- ✅ Dashboard requires authentication
- ✅ Tournament info can be edited and saved
- ✅ Registration list displays correctly
- ✅ Navigation updates based on auth status
- ✅ Logout clears session and redirects
- ✅ Registration form creates new admin account

This admin system provides a solid foundation for tournament management while maintaining the site's design consistency and user experience standards.
