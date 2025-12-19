import axios from "axios";


export const getExamsApi = async (courseCode) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/exams_apelli/${courseCode}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching exam data:", error);
        throw error;
    }
};


export const reloadDatabaseApi = async (year = null, name = null) => {
    try {
        const params = {
            year: year,
            name: name
        };

        const response = await axios.post('http://127.0.0.1:8000/reload_database', null, { params });
        console.log(response.status);
        return response.data;
    } catch (error) {
        console.error("Error reloading database:", error);
        throw error;
    }
};


export const getCoursesApi = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/courses');
        return response.data;
    } catch (error) {
        console.error("Error fetching courses data:", error);
        throw error;
    }
}