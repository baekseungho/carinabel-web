// src/api/AdminService.js
import axios from "./axios";

const API_URL = "/qna";

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
}

export default new AdminService();
