import axios from "./axios";

const API_URL_AUTH = "/users";

class AuthService {
    register(data) {
        return axios.post(`${API_URL_AUTH}/register`, data);
    }

    login(data) {
        return axios.post(`${API_URL_AUTH}/login`, data);
    }

    logout() {
        localStorage.removeItem("token");
    }

    getUserProfile(token) {
        return axios.get(`${API_URL_AUTH}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    updateUserProfile(data, token) {
        return axios.put(`${API_URL_AUTH}/profile`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new AuthService();
