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
        localStorage.removeItem("user");
    }

    findMemberId(data) {
        return axios.post(`${API_URL_AUTH}/find-member-id`, data);
    }
    resetPassword(data) {
        return axios.post(`${API_URL_AUTH}/reset-password`, data);
    }
    getUserProfile(token) {
        return axios.get(`${API_URL_AUTH}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    updateUserProfile(userId, additionalAmount, token) {
        console.log("📦 업데이트 요청:", { userId, additionalAmount });

        // 🔄 PUT 요청 수정
        return axios.put(
            `${API_URL_AUTH}/update-profile/${userId}`,
            {
                additionalAmount: additionalAmount,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }
}

export default new AuthService();
