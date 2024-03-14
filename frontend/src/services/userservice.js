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

const getCsrfToken = () => {
    const name = 'csrftoken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};


const updateProfile = async (data) => {
    try {
        console.log('Updating profile:', data);
        const csrfToken = getCsrfToken();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            // Send session cookies with the request

            withCredentials: true,
        };
        
        const response = await axios.put(`${BASE_URL}/api/user`, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { checkAuth, login, logout, signup, updateProfile, BASE_URL };