import initSqlJs from 'sql.js';

let db = null;

// Function to parse CSV data
const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, ''));
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
        // Initialize SQL.js
        const SQL = await initSqlJs({
            locateFile: file => `https://sql.js.org/dist/${file}`
        });

        // Create new database
        db = new SQL.Database();

        // Create tables
        createTables();

        // Load CSV data
        await loadCSVData();

        console.log('Database initialized successfully');
        return db;
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};

// Function to create database tables
const createTables = () => {
    // ExamSession table
    db.run(`
    CREATE TABLE IF NOT EXISTS ExamSession (
      id INTEGER PRIMARY KEY,
      name TEXT,
      academic_year TEXT,
      start_date TEXT,
      end_date TEXT
    )
  `);

    // SessionDay table
    db.run(`
    CREATE TABLE IF NOT EXISTS SessionDay (
      date TEXT PRIMARY KEY,
      exam_session_id INTEGER,
      FOREIGN KEY (exam_session_id) REFERENCES ExamSession(id)
    )
  `);

    // SemesterExamName table
    db.run(`
    CREATE TABLE IF NOT EXISTS SemesterExamName (
      id INTEGER PRIMARY KEY,
      academic_year TEXT,
      semester TEXT,
      exam_name TEXT,
      start_date TEXT,
      end_date TEXT,
      exam_session_id INTEGER,
      FOREIGN KEY (exam_session_id) REFERENCES ExamSession(id)
    )
  `);

    // Exam table
    db.run(`
    CREATE TABLE IF NOT EXISTS Exam (
      id INTEGER PRIMARY KEY,
      id_portale TEXT,
      date TEXT,
      start_time TEXT,
      end_time TEXT,
      application_deadline TEXT,
      registered_students_num INTEGER,
      is_visible INTEGER,
      exam_type_id INTEGER,
      exam_group_id INTEGER,
      semester_exam_name_id INTEGER,
      FOREIGN KEY (semester_exam_name_id) REFERENCES SemesterExamName(id)
    )
  `);

    // Course table
    db.run(`
    CREATE TABLE IF NOT EXISTS Course (
      id INTEGER PRIMARY KEY,
      course_code TEXT,
      course_name TEXT,
      professor_name TEXT,
      credits INTEGER,
      description TEXT,
      degree_programs TEXT
    )
  `);
};

// Function to load CSV data into tables
const loadCSVData = async () => {
    try {
        // Load ExamSession data
        const examSessionResponse = await fetch('/data/exam_sessions.csv');
        const examSessionCSV = await examSessionResponse.text();
        const examSessionData = parseCSV(examSessionCSV);

        const insertExamSessionStmt = db.prepare('INSERT INTO ExamSession (id, name, academic_year, start_date, end_date) VALUES (?, ?, ?, ?, ?)');
        examSessionData.data.forEach(row => {
            insertExamSessionStmt.run([row.id, row.name, row.academic_year, row.start_date, row.end_date]);
        });
        insertExamSessionStmt.free();

        // Load SessionDay data
        const sessionDayResponse = await fetch('/data/session_days.csv');
        const sessionDayCSV = await sessionDayResponse.text();
        const sessionDayData = parseCSV(sessionDayCSV);

        const insertSessionDayStmt = db.prepare('INSERT INTO SessionDay (date, exam_session_id) VALUES (?, ?)');
        sessionDayData.data.forEach(row => {
            insertSessionDayStmt.run([row.date, row.exam_session_id]);
        });
        insertSessionDayStmt.free();

        // Load SemesterExamName data
        const semesterExamResponse = await fetch('/data/semester_exam_names.csv');
        const semesterExamCSV = await semesterExamResponse.text();
        const semesterExamData = parseCSV(semesterExamCSV);

        const insertSemesterExamStmt = db.prepare('INSERT INTO SemesterExamName (id, academic_year, semester, exam_name, start_date, end_date, exam_session_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
        semesterExamData.data.forEach(row => {
            insertSemesterExamStmt.run([row.id, row.academic_year, row.semester, row.exam_name, row.start_date, row.end_date, row.exam_session_id]);
        });
        insertSemesterExamStmt.free();

        // Load Exam data
        const examResponse = await fetch('/data/exams.csv');
        const examCSV = await examResponse.text();
        const examData = parseCSV(examCSV);

        const insertExamStmt = db.prepare('INSERT INTO Exam (id, id_portale, date, start_time, end_time, application_deadline, registered_students_num, is_visible, exam_type_id, exam_group_id, semester_exam_name_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        examData.data.forEach(row => {
            insertExamStmt.run([
                row.id, row.id_portale, row.date, row.start_time, row.end_time,
                row.application_deadline, row.registered_students_num, row.is_visible,
                row.exam_type_id, row.exam_group_id, row.semester_exam_name_id
            ]);
        });
        insertExamStmt.free();

        // Load Course data
        const courseResponse = await fetch('/data/courses.csv');
        const courseCSV = await courseResponse.text();
        const courseData = parseCSV(courseCSV);

        const insertCourseStmt = db.prepare('INSERT INTO Course (id, course_code, course_name, professor_name, credits, description, degree_programs) VALUES (?, ?, ?, ?, ?, ?, ?)');
        courseData.data.forEach(row => {
            insertCourseStmt.run([row.id, row.course_code, row.course_name, row.professor_name, row.credits, row.description, row.degree_programs]);
        });
        insertCourseStmt.free();

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

    const searchQuery = `%${query.toLowerCase()}%`;
    const stmt = db.prepare(`
    SELECT DISTINCT c.*, sen.exam_name
    FROM Course c
    LEFT JOIN SemesterExamName sen ON c.course_name = sen.exam_name
    WHERE LOWER(c.course_name) LIKE ? 
       OR LOWER(c.professor_name) LIKE ? 
       OR LOWER(c.course_code) LIKE ?
    ORDER BY c.course_name
  `);

    const results = [];
    stmt.bind([searchQuery, searchQuery, searchQuery]);

    while (stmt.step()) {
        const row = stmt.getAsObject();
        results.push(row);
    }

    stmt.free();
    return results;
};

// Function to get course by ID
export const getCourseById = (courseId) => {
    if (!db) return null;

    const stmt = db.prepare(`
    SELECT c.*, sen.exam_name, sen.start_date as exam_start_date, sen.end_date as exam_end_date
    FROM Course c
    LEFT JOIN SemesterExamName sen ON c.course_name = sen.exam_name
    WHERE c.id = ?
  `);

    stmt.bind([courseId]);

    if (stmt.step()) {
        const result = stmt.getAsObject();
        stmt.free();
        return result;
    }

    stmt.free();
    return null;
};

// Function to get exams by course
export const getExamsByCourse = (courseName) => {
    if (!db) return [];

    const stmt = db.prepare(`
    SELECT e.*, sen.exam_name, c.course_code, c.professor_name
    FROM Exam e
    JOIN SemesterExamName sen ON e.semester_exam_name_id = sen.id
    JOIN Course c ON sen.exam_name = c.course_name
    WHERE c.course_name = ?
    ORDER BY e.date, e.start_time
  `);

    const results = [];
    stmt.bind([courseName]);

    while (stmt.step()) {
        const row = stmt.getAsObject();
        results.push(row);
    }

    stmt.free();
    return results;
};

// Function to get all exams in date range
export const getExamsInDateRange = (startDate, endDate) => {
    if (!db) return [];

    const stmt = db.prepare(`
    SELECT e.*, sen.exam_name, c.course_code, c.professor_name, c.course_name
    FROM Exam e
    JOIN SemesterExamName sen ON e.semester_exam_name_id = sen.id
    JOIN Course c ON sen.exam_name = c.course_name
    WHERE e.date >= ? AND e.date <= ?
    ORDER BY e.date, e.start_time
  `);

    const results = [];
    stmt.bind([startDate, endDate]);

    while (stmt.step()) {
        const row = stmt.getAsObject();
        results.push(row);
    }

    stmt.free();
    return results;
};

export default {
    initializeDatabase,
    getDatabase,
    searchCourses,
    getCourseById,
    getExamsByCourse,
    getExamsInDateRange
};