import axios from "axios";
// const baseUrl = "http://127.0.0.1:8000";   // for development
const baseUrl = "https://cas.polito.it/api/exams";  // for production


export const getExamsApi = async (courseCode) => {
    try {
        const response = await axios.get(`${baseUrl}/exams_appelli/${courseCode}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching exam data:", error);
        throw error;
    }
};


export const clearExamCacheApi = async (courseCode, authHeader = null) => {
    try {
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await axios.post(`${baseUrl}/clear_exam_cache/${courseCode}`, null, { headers });
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


export const reloadDatabaseApi = async (year = null, name = null, authHeader = null) => {
    try {
        const requestBody = {
            year: year,
            name: name
        };

        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await axios.post(`${baseUrl}/reload_database`, requestBody, { headers });
        console.log(response.status);
        return response.data;
    } catch (error) {
        console.error("Error reloading database:", error);
        throw error;
    }
};


export const reloadCachesApi = async (authHeader = null) => {
    try {
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await axios.post(`${baseUrl}/reload_caches`, null, { headers });
        console.log(response.status);
        return response.data;;
    } catch (error) {
        console.error("Error reloading caches:", error);
        throw error;
    }
};

export const syncDatabaseApi = async (keys, authHeader = null) => {
    try {
        const requestBody = { keys: keys };
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await axios.post(`${baseUrl}/sync_database`, requestBody, { headers });
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


export const exportExamsApi = async (year, name, collegi, authHeader = null) => {
    try {
        const requestBody = {
            year: year,
            name: name,
            collegi: collegi
        };
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await axios.post(`${baseUrl}/export_exams`, requestBody, { headers });
        console.log(response.status);
        return response.data;
    } catch (error) {
        console.error("Error exporting exams:", error);
        throw error;
    }
};


export const downloadFileApi = async (filename, authHeader = null) => {
    try {
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await axios.get(`${baseUrl}/download/${filename}`, {
            responseType: 'blob',
            headers
        });
        return response.data;
    } catch (error) {
        console.error("Error downloading file:", error);
        throw error;
    }
};


export const checkCredentialsApi = async (authHeader) => {
    try {
        const headers = { Authorization: authHeader };
        const response = await axios.post(`${baseUrl}/check_credentials`, null, { headers });
        return response.data;
    } catch (error) {
        console.error("Error checking credentials:", error);
        throw error;
    }
};