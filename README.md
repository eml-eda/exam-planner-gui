# University Exam Schedule Organizer GUI

React application for viewing university exam schedules, conflicts, and course details.

## Documentation

Detailed project and backend documentation:
- [doc/PROJECT_DOCUMENTATION.md](doc/PROJECT_DOCUMENTATION.md)

## Features

### Modern UI
- Glass-morphism inspired interface
- Smooth transitions and hover interactions

### Language support
- English and Italian UI
- Instant language switching
- Centralized translations

### Search
- Real-time course search
- Match by course name, course code, and instructor
- Highlighted matches with quick navigation to course page

### Exam calendar and conflicts
- Weekly calendar grouped by month
- Three views: full, compact, timed
- Color-coded exams:
	- Green: current course
	- Yellow: conflict in same year
	- Red: major conflict (same semester)
	- Neutral: no relevant conflict
- Tooltip with exam type, time, and conflict counters

### Course information
- Collapsible sections
- Course metadata and instances
- Active/new student counts

### Configuration, sync, and export
- Session configuration (year and session name)
- Cache/database reload actions
- Selective backend synchronization
- Excel export by selected collegi

### Authentication and permissions
- Login with Basic auth
- Role-based permissions (admin, editor, viewer)
- Protected routes and authenticated operations

## Tech stack

- React 18
- React Router v6
- Axios
- CSS

## Installation and setup

Prerequisites:
- Node.js 18+
- npm

Install and run:

```bash
npm install
npm start
```

Build for production:

```bash
npm run build
```

## Deployment

GitHub Actions automatically builds and deploys the app to GitHub Pages on push to main.
Workflow file: [.github/workflows/static.yml](.github/workflows/static.yml).

## Project structure

- [src](src): React app source code
- [src/components](src/components): reusable UI components and modals
- [src/pages](src/pages): page-level views
- [src/context](src/context): global state (auth, config, language)
- [src/utils](src/utils): API and utility modules
- [public](public): static assets and CSV data files
- [.github/workflows](.github/workflows): CI/CD workflow definitions
- [doc](doc): full technical documentation
