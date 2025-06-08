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
  getAllUsers(token) {
    return axios.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new AdminService();
