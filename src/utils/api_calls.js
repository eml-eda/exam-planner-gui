import axios from "axios";
// const baseUrl = "http://maira.polito.it:8001";
// const baseUrl = "https://maira.polito.it:8001";
const baseUrl = "http://127.0.0.1:8000";


export const getExamsApi = async (courseCode) => {
    try {
        const response = await axios.get(`${baseUrl}/exams_apelli/${courseCode}`);
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

        const response = await axios.post(`${baseUrl}/reload_database`, null, { params });
        console.log(response.status);
        return response.data;
    } catch (error) {
        console.error("Error reloading database:", error);
        throw error;
    }
};


export const getCoursesApi = async () => {
    try {
        const response = await axios.get(`${baseUrl}/courses`);
        return response.data;
    } catch (error) {
        console.error("Error fetching courses data:", error);
        throw error;
    }
}

export const getConfigApi = async () => {
    try {
        const response = await axios.get(`${baseUrl}/config`);
        return response.data;
    } catch (error) {
        console.error("Error fetching courses data:", error);
        throw error;
    }
}