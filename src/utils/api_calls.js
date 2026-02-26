import axios from "axios";
// const baseUrl = "http://maira.polito.it:8001";
// const baseUrl = "https://maira.polito.it:8001";
// const baseUrl = "http://127.0.0.1:8000";
const baseUrl = "https://cas.polito.it/api/exams";


export const getExamsApi = async (courseCode) => {
    try {
        const response = await axios.get(`${baseUrl}/exams_appelli/${courseCode}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching exam data:", error);
        throw error;
    }
};


export const clearExamCacheApi = async (courseCode) => {
    try {
        const response = await axios.post(`${baseUrl}/clear_exam_cache/${courseCode}`, null, null);
        console.log(response.status);
        return response.data;
    } catch (error) {
        console.error("Error clearing exam cache:", error);
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


export const reloadDatabaseApi = async (year = null, name = null) => {
    try {
        const requestBody = {
            year: year,
            name: name
        };

        const response = await axios.post(`${baseUrl}/reload_database`, requestBody);
        console.log(response.status);
        return response.data;
    } catch (error) {
        console.error("Error reloading database:", error);
        throw error;
    }
};


export const reloadCachesApi = async () => {
    try {
        const response = await axios.post(`${baseUrl}/reload_caches`);
        console.log(response.status);
        return response.data;;
    } catch (error) {
        console.error("Error reloading caches:", error);
        throw error;
    }
};

export const syncDatabaseApi = async (keys) => {
    try {
        const requestBody = { keys: keys };
        const response = await axios.post(`${baseUrl}/sync_database`, requestBody);
        console.log(response.status);
        return response.data;
    } catch (error) {
        console.error("Error syncing database:", error);
        throw error;
    }
};


export const getLastSyncTimeApi = async (key) => {
    try {
        const response = await axios.get(`${baseUrl}/last_sync_time/${key}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching last sync time:", error);
        throw error;
    }
}


export const exportExamsApi = async (year, name, collegi) => {
    try {
        const requestBody = {
            year: year,
            name: name,
            collegi: collegi
        };
        const response = await axios.post(`${baseUrl}/export_exams`, requestBody);
        console.log(response.status);
        return response.data;
    } catch (error) {
        console.error("Error exporting exams:", error);
        throw error;
    }
};


export const downloadFileApi = async (filename) => {
    try {
        const response = await axios.get(`${baseUrl}/download/${filename}`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error("Error downloading file:", error);
        throw error;
    }
};