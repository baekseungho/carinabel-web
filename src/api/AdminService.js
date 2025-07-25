// src/api/AdminService.js
import axios from "./axios";

const API_URL = "/qna";
const ADMIN_API_URL = "/admin";

class AdminService {
    answerQna(qnaId, data, token) {
        return axios.put(`${API_URL}/answer/${qnaId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    getAllQnas(token) {
        return axios.get(`${API_URL}/admin`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    adminLogin(data) {
        return axios.post(`${ADMIN_API_URL}/login`, data);
    }
    adminCreate(data) {
        return axios.post(`${ADMIN_API_URL}/create`, data);
    }
    getFilteredUsers(params, token) {
        return axios.get("/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
    }

    getAllOrders(token, params) {
        return axios.get("/admin/orders", {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
    }

    getAllProducts(token) {
        return axios.get(`${ADMIN_API_URL}/products`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // 상품 추가
    addProduct(productData, token) {
        return axios.post(`${ADMIN_API_URL}/products/add`, productData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // 상품 삭제
    deleteProduct(productId, token) {
        return axios.delete(`${ADMIN_API_URL}/products/delete/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // 상품 수정
    updateProduct(productId, updatedData, token) {
        return axios.put(`${ADMIN_API_URL}/products/update/${productId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // 키트 전체 조회
    getKits(token) {
        return axios.get(`${ADMIN_API_URL}/kits`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    // 키트 추가
    createKit(kitData, token) {
        return axios.post(`${ADMIN_API_URL}/kits/create`, kitData, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    // 키트 수정
    updateKit(kitId, updatedData, token) {
        return axios.put(`${ADMIN_API_URL}/kits/${kitId}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
    // 키트 삭제
    deleteKit(kitId, token) {
        return axios.delete(`${ADMIN_API_URL}/kits/${kitId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    getReferralEarningsList = (token, params) => {
        return axios.get(`${ADMIN_API_URL}/referral-earnings`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
    };
    getReferralDetails = (token, userId) => {
        return axios.get(`${ADMIN_API_URL}/referral-details/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    // 수당 지급
    payReferral(data, token) {
        return axios.post(`${ADMIN_API_URL}/referral-pay`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    getAdminOrders(params, token) {
        return axios.get(`${ADMIN_API_URL}/admin-orders`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
    }

    updateOrderStatus(orderId, status, token) {
        return axios.put(
            `${ADMIN_API_URL}/update-order-status/${orderId}`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    }

    getWithdrawnUsers(params, token) {
        return axios.get("/admin/withdrawn-users", {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
    }

    restoreUser(userId, token) {
        return axios.put(
            `/admin/restore/${userId}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    }

    // 1. 취소대기 주문 목록 조회
    getPendingCancelOrders(token) {
        return axios.get("/admin/cancel-pending", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // 2. 관리자 주문 취소 처리
    cancelOrderAsAdmin(orderNumber, payload, token) {
        return axios.post(
            `/admin/cancel-order/${orderNumber}`,
            {
                trxId: payload.trxId,
                amount: payload.amount,
                reason: payload.reason,
                payMethod: "CARD", // 고정
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
    }

    // 🔧 관리자 수기 회원가입
    manualRegister(userData, token) {
        return axios.post("/admin/manual-register", userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    manualOrder(orderData, token) {
        return axios.post("/admin/manual-order", orderData, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}

export default new AdminService();
