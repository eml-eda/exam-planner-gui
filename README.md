# Exams App

Exams App is a React frontend for browsing university exam sessions and conflicts.
It connects to a backend API for authentication, data loading, synchronization, and export tasks.

## What this project does

- Course search by name, code, and instructor
- Course detail view with exam conflict calendar
- English and Italian interface
- Login with role-based permissions
- Session configuration and backend sync tools
- Export of exam data files

## Documentation

Detailed technical documentation is available in [doc/PROJECT_DOCUMENTATION.md](doc/PROJECT_DOCUMENTATION.md).


## Tech stack

- React 18
- React Router v6
- Axios
- CSS

## Quick start

Prerequisites:
- Node.js 18+
- npm

Run locally:

```bash
npm install
npm start
```

Create production build:

```bash
npm run build
```

## Deployment on GitHub Pages

This repository is configured with GitHub Actions in [.github/workflows/static.yml](.github/workflows/static.yml).

On each push to main, the workflow:
1. Installs dependencies
2. Builds the React app
3. Uploads the build output
4. Deploys to GitHub Pages

## Project structure

- [.github/workflows](.github/workflows): CI/CD workflows
- [public](public): static assets and CSV data files
- [src](src): application source code
- [src/components](src/components): reusable UI components and modals
- [src/pages](src/pages): route-level pages
- [src/context](src/context): global state providers
- [src/utils](src/utils): API and local utility helpers
- [doc](doc): project documentation