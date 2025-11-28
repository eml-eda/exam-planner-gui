// Simple in-memory database using localStorage for persistence
let db = null;

const DB_KEY = 'exams-app-database';

// Function to parse CSV data
const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return { headers: [], data: [] };

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
        }, {});
    });
    return { headers, data };
};

// Function to initialize the database
export const initializeDatabase = async () => {
    try {
        // Check if data exists in localStorage
        const existingData = localStorage.getItem(DB_KEY);
        if (existingData) {
            db = JSON.parse(existingData);
            console.log('Database loaded from localStorage');
            return db;
        }

        // Initialize empty database
        db = {
            examSessions: [],
            sessionDays: [],
            semesterExamNames: [],
            exams: [],
            courses: []
        };

        // Load CSV data
        await loadCSVData();

        // Save to localStorage
        localStorage.setItem(DB_KEY, JSON.stringify(db));

        console.log('Database initialized successfully');
        return db;
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};

// Function to load CSV data into tables
const loadCSVData = async () => {
    try {
        // Load ExamSession data
        const examSessionResponse = await fetch('./data/exam_sessions.csv');
        const examSessionCSV = await examSessionResponse.text();
        const examSessionData = parseCSV(examSessionCSV);
        db.examSessions = examSessionData.data;

        // Load SessionDay data
        const sessionDayResponse = await fetch('./data/session_days.csv');
        const sessionDayCSV = await sessionDayResponse.text();
        const sessionDayData = parseCSV(sessionDayCSV);
        db.sessionDays = sessionDayData.data;

        // Load SemesterExamName data
        const semesterExamResponse = await fetch('./data/semester_exam_names.csv');
        const semesterExamCSV = await semesterExamResponse.text();
        const semesterExamData = parseCSV(semesterExamCSV);
        db.semesterExamNames = semesterExamData.data;

        // Load Exam data
        const examResponse = await fetch('./data/exams.csv');
        const examCSV = await examResponse.text();
        const examData = parseCSV(examCSV);
        db.exams = examData.data;

        // Load Course data
        const courseResponse = await fetch('./data/courses.csv');
        const courseCSV = await courseResponse.text();
        const courseData = parseCSV(courseCSV);
        db.courses = courseData.data;

        console.log('CSV data loaded successfully');
    } catch (error) {
        console.error('Error loading CSV data:', error);
        throw error;
    }
};

// Function to get the database instance
export const getDatabase = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
};

// Function to search courses
export const searchCourses = (query) => {
    if (!db || !query) return [];

    const searchQuery = query.toLowerCase();

    return db.courses.filter(course => {
        const courseName = course.course_name?.toLowerCase() || '';
        const professorName = course.professor_name?.toLowerCase() || '';
        const courseCode = course.course_code?.toLowerCase() || '';

        return (
            courseName.includes(searchQuery) ||
            professorName.includes(searchQuery) ||
            courseCode.includes(searchQuery)
        );
    });
};

// Function to get course by ID
export const getCourseById = (courseId) => {
    if (!db) return null;

    const course = db.courses.find(c => c.id === courseId);
    if (!course) return null;

    // Find related semester exam name
    const semesterExam = db.semesterExamNames.find(sen =>
        sen.exam_name === course.course_name
    );

    return {
        ...course,
        exam_name: semesterExam?.exam_name,
        exam_start_date: semesterExam?.start_date,
        exam_end_date: semesterExam?.end_date
    };
};

// Function to get exams by course
export const getExamsByCourse = (courseName) => {
    if (!db) return [];

    // Find the course
    const course = db.courses.find(c => c.course_name === courseName);
    if (!course) return [];

    // Find semester exam name
    const semesterExam = db.semesterExamNames.find(sen =>
        sen.exam_name === courseName
    );

    if (!semesterExam) return [];

    // Find exams for this semester exam
    return db.exams
        .filter(exam => exam.semester_exam_name_id === semesterExam.id)
        .map(exam => ({
            ...exam,
            exam_name: semesterExam.exam_name,
            course_code: course.course_code,
            course_name: course.course_name,
            professor_name: course.professor_name
        }));
};

// Function to get all exams in date range
export const getExamsInDateRange = (startDate, endDate) => {
    if (!db) return [];

    return db.exams
        .filter(exam => exam.date >= startDate && exam.date <= endDate)
        .map(exam => {
            // Find the semester exam name
            const semesterExam = db.semesterExamNames.find(sen =>
                sen.id === exam.semester_exam_name_id
            );

            // Find the course
            const course = db.courses.find(c =>
                c.course_name === semesterExam?.exam_name
            );

            return {
                ...exam,
                exam_name: semesterExam?.exam_name,
                course_code: course?.course_code,
                course_name: course?.course_name,
                professor_name: course?.professor_name
            };
        })
        .filter(exam => exam.course_name); // Filter out exams without course data
};

// Function to clear database (for testing)
export const clearDatabase = () => {
    localStorage.removeItem(DB_KEY);
    db = null;
};

const databaseApi = {
    initializeDatabase,
    getDatabase,
    searchCourses,
    getCourseById,
    getExamsByCourse,
    getExamsInDateRange,
    clearDatabase
};

export default databaseApi;