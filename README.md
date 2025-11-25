# University Exam Schedule Organizer

A modern React application for organizing and viewing university exam schedules with a beautiful glass-morphism design.

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
  - 🟡 **Yellow**: Conflicts (±1 day)
  - 🔴 **Red**: Major conflicts (±2 days)
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

## Data Structure

The application uses the following database schema:

### ExamSession
- `id` (Primary Key)
- `name`
- `academic_year`
- `start_date`
- `end_date`

### SessionDay
- `date` (Primary Key)
- `exam_session_id` (Foreign Key)

### SemesterExamName
- `id` (Primary Key)
- `academic_year`
- `semester`
- `exam_name`
- `start_date`
- `end_date`
- `exam_session_id` (Foreign Key)

### Exam
- `id` (Primary Key)
- `id_portale`
- `date`
- `start_time`
- `end_time`
- `application_deadline`
- `registered_students_num`
- `is_visible`
- `exam_type_id`
- `exam_group_id`
- `semester_exam_name_id` (Foreign Key)

### Course
- `id` (Primary Key)
- `course_code`
- `course_name`
- `professor_name`
- `credits`
- `description`
- `degree_programs`

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

3. **Start development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Open your browser and go to `http://localhost:3000`

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

## Data Customization

To use your own data:

1. **Replace CSV files** in `public/data/` with your own:
   - `exam_sessions.csv`
   - `session_days.csv`
   - `semester_exam_names.csv`
   - `exams.csv`
   - `courses.csv`

2. **Follow the CSV format** shown in the existing files

3. **Restart the application** - data will be automatically loaded

## Architecture Highlights

### Offline-First Design
- **No server dependencies** after initial load
- **localStorage persistence** for settings and data
- **CSV-based data loading** via fetch API
- **Works completely offline** after first visit

### Responsive Design
- **Mobile-first approach**
- **Flexible layouts** that adapt to screen size
- **Touch-friendly interface**
- **Optimized for all devices**

### Performance Optimizations
- **Lazy loading** of components
- **Efficient re-renders** with React hooks
- **Debounced search** to prevent excessive queries
- **Cached data** in memory and localStorage

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features
- CSS Grid and Flexbox
- Local storage API

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

## License

This project is open source and available under the MIT License.

## Support

For questions or support, please refer to the code documentation or create an issue in the project repository.