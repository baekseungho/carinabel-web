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

    updateOrderStatus(orderId, status, token, reason = "") {
        return axios.put(
            `/orders/update-status/${orderId}`,
            { status, reason },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }
    getOrderDetail(orderId, token) {
        return axios.get(`${API_URL}/detail/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    confirmOrder(orderId, token) {
        return axios.post(`${API_URL}/confirm/${orderId}`, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
    cancelOrder(orderId, payload, token) {
        return axios.post(`${API_URL}/cancel/${orderId}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    // getPaymentStatus(tid, jwtToken) {
    //     return axios.get(`/payment/status/${tid}`, {
    //         baseURL: "https://api.kiwoompay.co.kr/api", // 윈페이 API
    //         headers: {
    //             Authorization: `Bearer ${jwtToken}`,
    //         },
    //     });
    // }

    getPaymentStatus(orderNo, jwtToken) {
        return axios.get(`/payment/status/${orderNo}?token=${jwtToken}`);
    }
    getWinpayJwtToken() {
        return axios.get("/payment/token");
    }
    deleteUnpaidOrder(orderId, token) {
        return axios.delete(`/orders/delete-unpaid/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new OrderService();
