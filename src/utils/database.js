import { getCoursesApi } from '../utils/api_calls';
let courses = null;

const COURSES_KEY = 'exams-app-courses';
const COURSES_VERSION_KEY = 'exams-app-courses-version';
const CURRENT_COURSES_VERSION = '1.0.0';

// Function to initialize courses from back-end API **
export const initializeCourses = async () => {
    // Check version and clear cache if outdated
    const storedVersion = localStorage.getItem(COURSES_VERSION_KEY);
    if (storedVersion !== CURRENT_COURSES_VERSION) {
        console.log('Courses version mismatch, clearing cache...');
        localStorage.removeItem(COURSES_KEY);
        localStorage.setItem(COURSES_VERSION_KEY, CURRENT_COURSES_VERSION);
    }

    // Check if courses exist in localStorage
    const cachedCourses = localStorage.getItem(COURSES_KEY);
    if (cachedCourses) {
        try {
            courses = JSON.parse(cachedCourses);
            console.log('Courses loaded from localStorage');
            return courses;
        } catch (error) {
            console.error('Error parsing cached courses:', error);
            localStorage.removeItem(COURSES_KEY);
        }
    }

    // Fetch from API if not in cache
    console.log('Fetching courses from API...');
    courses = await getCoursesApi();

    // Save to localStorage
    try {
        localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
        console.log('Courses saved to localStorage');
    } catch (error) {
        console.error('Error saving courses to localStorage:', error);
    }

    return courses;
}

// Function to refresh courses from API and update localStorage **
export const refreshCoursesFromApi = async () => {
    console.log('Refreshing courses from API...');
    courses = await getCoursesApi();

    // Update localStorage
    try {
        localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
        console.log('Courses refreshed and saved to localStorage');
    } catch (error) {
        console.error('Error saving refreshed courses to localStorage:', error);
    }

    return courses;
};

// Function to clear courses cache **
export const clearCoursesCache = () => {
    localStorage.removeItem(COURSES_KEY);
    courses = null;
    console.log('Courses cache cleared');
};


// Function to search courses **
export const searchCourses = (query) => {
    if (!courses || !query) return [];

    const searchQuery = query.toLowerCase();

    return courses.filter(course => {
        const courseTitle = course.title?.toLowerCase() || '';
        const courseCode = course.code?.toLowerCase() || '';

        // Search in instructors names
        const instructorMatch = course.instructors?.some(instructor =>
            instructor.name?.toLowerCase().includes(searchQuery)
        ) || false;

        return (
            courseTitle.includes(searchQuery) ||
            courseCode.includes(searchQuery) ||
            instructorMatch
        );
    });
};

// Function to get course by code **
export const getCourseById = async (courseCode) => {
    if (!courses) {
        await initializeCourses();
    }

    if (!courses) return null;

    const course = courses.find(c => c.code === courseCode);
    return course || null;
};


const databaseApi = {
    initializeCourses,
    searchCourses,
    getCourseById,
    refreshCoursesFromApi,
    clearCoursesCache
};

export default databaseApi;