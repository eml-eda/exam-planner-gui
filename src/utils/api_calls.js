import axios from "axios";


export const getExamConflicts = async (courseCode) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/exams_apelli/${courseCode}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching exam data:", error);
        throw error;
    }
};