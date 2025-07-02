import axios from "./axios";

const API_URL_PAYMENT = "/payment";

class PayService {
    // 결제 요청
    requestPayment(data, token) {
        return axios.post(`${API_URL_PAYMENT}/request`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // 결제 상태 확인
    checkPaymentResult(tid, token) {
        return axios.get(`${API_URL_PAYMENT}/status/${tid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    requestBankPay(data, token) {
        return axios.post(`${API_URL_PAYMENT}/bankpay/request`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new PayService();
