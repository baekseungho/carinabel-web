import axios from "./axios";

const API_URL = "/orders";

class OrderService {
    // 일반 주문 검색
    getOrders(userId, token) {
        return axios.get(`${API_URL}?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // 추천 하위 주문 검색
    getReferredOrders(referrerId, token) {
        return axios.get(`${API_URL}/referred/${referrerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new OrderService();
