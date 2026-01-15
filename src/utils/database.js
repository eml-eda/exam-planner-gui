import { getCoursesApi } from '../utils/api_calls';
let courses = null;

// Function to initialize courses from back-end API
export const initializeCourses = async () => {
    console.log('Fetching courses from API...');
    const response = await getCoursesApi();
    courses = response.courses.result;
    return response;
}

// Function to search courses
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

// Function to get course by code
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
    getCourseById
};

export default databaseApi;