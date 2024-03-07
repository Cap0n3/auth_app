import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// === Axios Configuration === //
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.withCredentials = true;

// === Axios Client === //
const client = axios.create({
    baseURL: BASE_URL
});

const checkAuth = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/user`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

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

const signup = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/register`, credentials);
        return response.data;
    } catch (error) {
        throw error; // Handle or log the error appropriately
    }
};

export { checkAuth, login, logout, signup, BASE_URL };