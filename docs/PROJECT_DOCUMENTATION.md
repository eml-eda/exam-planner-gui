# Exams App - Full Project Documentation

## 1. Project Overview

A React web application used to explore university exams.
It provides:
- Authentication with role-based backend permissions.
- Course search by title, code, and instructor.
- Course detail pages with exam conflict visualization.
- Session configuration and backend sync tools.
- Export of exam data files.
- English/Italian interface.

The frontend is a static React build. Runtime data comes from a backend API.

## 2. High-Level Architecture

### 2.1 Frontend stack
- React 18 (function components and hooks)
- React Router v6 (HashRouter)
- Axios for API calls
- Context API for app-wide state (auth, config, language)

### 2.2 Main data flow
1. User logs in.
2. App loads configuration from backend.
3. App loads courses from backend.
4. User searches courses and opens course pages.
5. Course page requests exam conflicts for selected course.
6. User can refresh caches, reload database config, sync specific backend keys, and export files.

### 2.3 State model
- Auth state: in AuthContext with storage persistence (localStorage/sessionStorage).
- Config state: in ConfigContext with backend-backed values and stale-check logic.
- Language state: in LanguageContext with translation dictionary and toggle.

## 3. Routing and Access Control

Routes are defined in src/App.js:
- /login -> Login page
- / -> Home page (protected)
- /course/:courseId -> Course page (protected)

Protected routes use a wrapper that checks isAuthenticated from AuthContext and redirects to /login when needed.

## 4. Authentication Model

Auth is managed in src/context/AuthContext.js.

Key behavior:
- Credentials are sent as HTTP Basic Authorization header.
- Backend is verified through check_credentials endpoint.
- rememberMe=true stores auth payload in localStorage with 1-week expiration.
- rememberMe=false stores auth payload in sessionStorage.
- On app mount, stored credentials are re-validated with backend before restoring session.

Important note:
- User password is stored client-side to recreate Basic auth headers.

## 5. Backend API Integration

All API calls are centralized in src/utils/api_calls.js.

Base URL can be set to:
- http://127.0.0.1:8000 or https://cas.polito.it/api/exams

Endpoints used:
- GET /courses
- GET /config
- GET /exams_appelli/{courseCode}
- POST /clear_exam_cache/{courseCode}
- POST /reload_caches
- POST /reload_database
- POST /sync_database
- GET /last_sync_time/{key}
- POST /export_exams
- GET /download/{filename}
- POST /check_credentials

## 6. Main Functionalities

### 6.1 Home page
- Preloads courses through initializeCourses.
- Shows fetch source indicator (cache vs fresh).
- Supports language toggle.
- Supports cache reload action.
- Opens Settings, Export, and Login modals.
- Shows recently viewed courses (localStorage-backed: /utils/recentCourses.js).

### 6.2 Course page
- Loads course by code from in-memory course variable (/utils/database.js).
- Loads exam conflicts from backend.
- Supports exam cache refresh for current course.
- Shows exam calendar with 3 views:
  - full
  - compact
  - timed
- Supports navigation to other courses by clicking related exams.
- Persists visited course in recent history.

### 6.3 Calendar and conflicts
CalendarView renders grouped monthly weeks and exam entries by day.
Color logic:
- current-course: selected course exams
- conflict-major: high-conflict, same semester and year
- conflict-minor: conflict, same year
- neutral: no relevant conflict

Tooltip displays detailed exam metadata and conflict counters.

### 6.4 Settings and synchronization
SettingsModal supports:
- Reload database with selected year/session.
- Sync selected backend keys (classrooms, courses, enrollments_dir, exam_groups, exams, offerings).
- Warning gate when syncing exams without offerings if offerings are stale/missing.

### 6.5 Export
ExportModal supports:
- Choosing session context (year/session).
- Selecting collegi from backend config.
- Triggering export on backend.
- Downloading returned file blob in browser.

### 6.6 Search
SearchComponent supports:
- Debounced search (300ms).
- Match on course title, code, and instructor names.
- Highlighting matched text.
- Keyboard-friendly input focus behavior.

## 7. Automatic Build and GitHub Hosting

Deployment pipeline is defined in .github/workflows/static.yml.

Trigger:
- On push to main
- Manual trigger through workflow_dispatch

Pipeline steps:
1. Checkout repository.
2. Setup Node 18.
3. Install dependencies (npm install).
4. Build app (npm run build).
5. Configure GitHub Pages.
6. Upload build folder as Pages artifact.
7. Deploy artifact to GitHub Pages.

## 8. Folder-by-Folder Reference (important files)

### 8.1 .github/workflows
- static.yml: CI/CD workflow for build and GitHub Pages deployment.

### 8.2 public
- index.html: HTML template used by React build.
- favicon.ico, logo512.png: static branding assets.

### 8.3 src
- index.js: React entry point, mounts App.
- index.css: global styles and shared visual variables.
- App.js: providers setup, router setup, protected route logic.

src/context:
- AuthContext.js: authentication, storage persistence, auth header generation.
- ConfigContext.js: backend config state, stale-check cache, force refresh helper.
- LanguageContext.js: translation dictionary and language toggle.

src/pages:
- Home.js: dashboard/home page and top-level actions.
- Course.js: course detail page, exams view, and course info panels.
- Login.js: dedicated login page for unauthenticated users.

src/components:
- SearchComponent.js: debounced search UI and result navigation.
- CalendarView.js: exam calendar rendering and conflict highlighting.
- SettingsModal.js: session config changes and selective backend sync.
- ExportModal.js: exam export modal with collegi selection and download.
- LoginModal.js: in-app login/logout modal.
- CredErrorModal.js: standardized auth/permission/backend error modal.

src/utils:
- api_calls.js: all HTTP requests to backend API endpoints.
- database.js: in-memory course data initialization/search/access helpers.
- recentCourses.js: localStorage helpers for recently viewed courses.

## 9. Local Development and Build Commands

From project root:
- npm install
- npm start
- npm run build
- npm test

## 10. Operational Notes and Maintenance

- Keep API baseUrl in src/utils/api_calls.js aligned with target backend environment.
- Because HashRouter is used, the app works well with GitHub Pages static hosting paths.
- If backend changes, update api_calls.js and database.js files.
- When adding new UI text, extend translations in LanguageContext to keep EN/IT parity.

## 11. API Contract (Backend)

Backend framework: FastAPI

Authentication:
- Protected endpoints require header: Authorization: Basic <base64(username:password)>
- Public endpoints: GET /, GET /courses, GET /config, GET /exams_appelli/{course_code}, GET /last_sync_time/{key}

## 12. Permission Matrix

Configured users:
- admin 
- editor 
- viewer 

Permissions by role:

| Endpoint | Permission needed | admin | editor | viewer |
|---|---|---|---|---|
| GET /courses | none | Yes | Yes | Yes |
| GET /config | none | Yes | Yes | Yes |
| GET /exams_appelli/{course_code} | none | Yes | Yes | Yes |
| GET /last_sync_time/{key} | none | Yes | Yes | Yes |
| POST /reload_database | write | Yes | Yes | No |
| POST /reload_caches | write | Yes | Yes | No |
| POST /clear_exam_cache/{course_code} | write | Yes | Yes | No |
| POST /export_exams | export | Yes | No | No |
| GET /download/{filename} | export | Yes | No | No |
| POST /sync_database | sync | Yes | No | No |

## 13. Troubleshooting Guide

### 13.1 Backend unavailable from frontend

Symptoms:
- Home/Course page shows backend error modal
- Network errors in browser console

Checks:
1. Verify backend process is running.
2. Verify base URL in src/utils/api_calls.js matches running backend.
3. Open GET / directly in browser and confirm version JSON is returned.

### 13.2 CORS errors in browser

Symptoms:
- Browser console shows CORS blocked request

Checks:
1. Confirm backend ENV value is correct (development or production).
2. In development, frontend origin must be http://localhost:3000 or http://127.0.0.1:3000.
3. In production, requests must originate from configured GitHub Pages origin.

### 13.3 401 authentication errors

Symptoms:
- Login fails with invalid credentials
- Protected actions fail even after login

Checks:
1. Validate username/password against ALLOWED_USERS.
2. Ensure Authorization header format is Basic <base64(username:password)>.
3. Re-login to refresh stored credentials in localStorage/sessionStorage.

### 13.4 403 permission denied

Symptoms:
- editor/viewer cannot sync or export

Cause:
- Endpoint requires a permission not in the user role.

Action:
1. Use an account with required permission (usually admin for export/sync).
2. Confirm required permission in the matrix in section 12.

### 13.5 503 initialization/reload in progress

Symptoms:
- API returns: Database initialization in progress or Database reload in progress

Cause:
- Backend is executing startup initialization, reload, or synchronization.

Action:
1. Wait and retry after a short delay.
2. Avoid triggering multiple reload/sync operations concurrently.

### 13.6 Stale config mismatch warning in frontend

Symptoms:
- Frontend displays backend configuration mismatch modal and reloads page

Cause:
- Frontend cached config differs from backend /config response.

Action:
1. Let frontend refresh automatically.
2. If issue persists, clear browser storage and reload.

### 13.7 Export file download issues

Symptoms:
- Export succeeds but download fails
- Download endpoint returns 404

Checks:
1. Ensure /export_exams response includes filename.
2. Download file immediately after export (file is removed after download response).
3. Ensure filename is not modified and does not include path characters.