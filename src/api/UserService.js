import axios from "./axios";

const API_URL = "/users";

class UserService {
    getUserStats(userId, token) {
        return axios.get(`${API_URL}/stats/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new UserService();
