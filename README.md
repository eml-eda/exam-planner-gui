# University Exam Schedule Organizer GUI

A React application for organizing and viewing university exam schedules.

## Features

### 🎨 Modern UI/UX
- **Glass-morphism design** with silver-themed UI
- **Smooth animations** and hover effects
- **Responsive layout** that works on all devices
- **Professional university aesthetic**

### 🌐 Language Support
- **Bilingual support** (English/Italian)
- **Real-time language switching**
- **Context-based translations**

### 🔍 Advanced Search
- **Real-time search** with expanding results panel
- **Multi-criteria matching** (course name, professor, course code)
- **Highlighted search results**
- **Clickable course navigation**

### 📅 Interactive Calendar
- **Weekly calendar view** with scrollable months
- **Color-coded exams**:
  - 🟢 **Green**: Current course exams
  - 🟡 **Yellow**:
  - 🔴 **Red**: 
  - ⚪ **Neutral**: Other exams
- **Hover tooltips** with detailed exam information
- **Configurable date ranges**

### 📊 Course Information
- **Collapsible sections** for better organization
- **Comprehensive course details**
- **Exam instances and scheduling**
- **Student enrollment numbers**

### ⚙️ Configuration
- **Date range settings** for exam periods
- **Persistent settings** using localStorage
- **Modal-based configuration**

## Technology Stack

- **React 18** with functional components and hooks
- **React Router** for navigation with proper browser back button support
- **CSS3** with custom properties and animations
- **Local data storage** using localStorage
- **CSV data import** with client-side processing
- **100% client-side** - no server required


## Installation and Setup

### Prerequisites
- Node.js (14 or higher)
- npm or yarn

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd exams-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `build/` directory and can be deployed to any static hosting service like:
- GitHub Pages
- Netlify
- Vercel
- Amazon S3
- Any web server

## Usage Guide

### Home Page
1. **Search for courses** using the central search bar
2. **Toggle language** using the ENG/IT button
3. **Access settings** via the gear icon (Config button)
4. **Navigate back** using the back arrow (when available)

### Search Functionality
1. Type in the search bar to find courses
2. Search works across:
   - Course names
   - Professor names
   - Course codes
3. Click on any result to view course details

### Course Page
1. **Course Exams Section**: View calendar with exam schedule
2. **Course Info Section**: See detailed course information
3. **Interactive elements**: 
   - Hover over exams for details
   - Click on other exams to navigate
   - Use collapsible sections

### Settings
- Configure exam date ranges
- Settings persist between sessions
- Default range: January 1, 2026 - February 28, 2026

## Customization

### Theming
The application uses CSS custom properties for easy theming. Main variables are in `src/index.css`:

```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  /* ... more variables */
}
```

### Translations
Add new translations in `src/context/LanguageContext.js`:

```javascript
const translations = {
  newKey: { en: 'English Text', it: 'Testo Italiano' },
  // ... more translations
};
```

### Colors
Exam colors can be customized in `src/components/CalendarView.css`:

```css
.exam-item.current-course { background: var(--success-green); }
.exam-item.conflict-minor { background: var(--warning-yellow); }
.exam-item.conflict-major { background: var(--danger-red); }
```