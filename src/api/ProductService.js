import axios from "./axios";

const API_URL_PRODUCT = "/products";

class ProductService {
    getProducts(token) {
        return axios.get(`${API_URL_PRODUCT}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    getProduct(id, token) {
        return axios.get(`${API_URL_PRODUCT}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    login(data) {
        return axios.post(`${API_URL_AUTH}/login`, data);
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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

export default new ProductService();
