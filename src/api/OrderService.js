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
    getOrdersWithPaging(params, token) {
        return axios.get(`${API_URL}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params, // ← GET 쿼리로 page, size, userId, status 전달
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

    getReferredOrdersWithPaging(params, token) {
        return axios.get(`${API_URL}/referred-paged`, {
            headers: { Authorization: `Bearer ${token}` },
            params, // { referrerId, page, size }
        });
    }

    createOrder(orderData, token) {
        return axios.post("/orders/create", orderData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    getOrderDetail(orderId, token) {
        return axios.get(`${API_URL}/detail/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new OrderService();
