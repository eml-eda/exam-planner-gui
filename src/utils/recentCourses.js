// Utility functions for managing recently viewed courses in localStorage

const RECENT_COURSES_KEY = 'recentlyViewedCourses';
const MAX_RECENT_COURSES = 8;

/**
 * Add a course to the recently viewed list
 * @param {Object} course - Course object with title, code, students_active, students_new, instances
 */
export const addRecentCourse = (course) => {
    try {
        // Get existing courses from localStorage
        const existingCourses = getRecentCourses();

        // Remove the course if it already exists (to avoid duplicates)
        const filteredCourses = existingCourses.filter(c => c.code !== course.code);

        // Add the new course at the beginning
        const updatedCourses = [course, ...filteredCourses];

        // Keep only the first 5 courses (remove last if exceeds limit)
        const limitedCourses = updatedCourses.slice(0, MAX_RECENT_COURSES);

        // Save to localStorage
        localStorage.setItem(RECENT_COURSES_KEY, JSON.stringify(limitedCourses));

        console.log('Course added to recently viewed:', course.code);
    } catch (error) {
        console.error('Error saving recent course to localStorage:', error);
    }
};

/**
 * Get all recently viewed courses from localStorage
 * @returns {Array} Array of recently viewed courses
 */
export const getRecentCourses = () => {
    try {
        const coursesJson = localStorage.getItem(RECENT_COURSES_KEY);
        if (!coursesJson) {
            return [];
        }
        return JSON.parse(coursesJson);
    } catch (error) {
        console.error('Error reading recent courses from localStorage:', error);
        return [];
    }
};

/**
 * Clear all recently viewed courses
 */
export const clearRecentCourses = () => {
    try {
        localStorage.removeItem(RECENT_COURSES_KEY);
        console.log('Recently viewed courses cleared');
    } catch (error) {
        console.error('Error clearing recent courses:', error);
    }
};
