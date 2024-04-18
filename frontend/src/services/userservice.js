import axios from "axios";

const BASE_URL = "http://localhost:8000";

// === Axios Configuration === //
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// === Axios Client === //
const client = axios.create({
    baseURL: BASE_URL,
});

const checkAuth = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/user`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const signup = async (credentials) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/register`,
            credentials,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

const login = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/login`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const logout = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/api/logout`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateProfile = async (data, csrf_token) => {
    try {
        // create headers
        const headers = {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrf_token,
        };
        const response = await axios.put(`${BASE_URL}/api/update`, data, {
            headers,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updatePassword = async (data) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/change-password`,
            data,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

const sendResetPasswordEmail = async (data) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/send-reset-password`,
            data,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

const resetUserPassword = async (data) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/reset-password`,
            data,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    checkAuth,
    login,
    logout,
    signup,
    updateProfile,
    updatePassword,
    sendResetPasswordEmail,
    resetUserPassword,
    BASE_URL,
};
