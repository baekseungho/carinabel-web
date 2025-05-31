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

  getUserProfile(token) {
    return axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getUserNetwork(token, userId, period) {
    return axios.get(`${API_URL}/network/${userId}?period=${period}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getReferralEarningsByMonth(userId, yearMonth, token) {
    return axios.get(`/users/referral-earnings/${userId}/${yearMonth}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getReferralStats(userId, token) {
    return axios.get(`/users/referral-earnings/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new UserService();
