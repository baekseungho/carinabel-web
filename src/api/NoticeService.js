import axios from "./axios";

const API_URL = "/notices";

class NoticeService {
    // 전체 공지 목록 조회 (페이징 포함)
    getNoticeList(params, token) {
        return axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params, // page, size
        });
    }

    // 공지 상세 조회
    getNoticeDetail(noticeId, token) {
        return axios.get(`${API_URL}/${noticeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // 관리자 - 공지 추가
    createNotice(noticeData, token) {
        return axios.post(`/admin/notices/add`, noticeData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // 관리자 - 공지 수정
    updateNotice(noticeId, noticeData, token) {
        return axios.put(`/admin/notices/update/${noticeId}`, noticeData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // 관리자 - 공지 삭제
    deleteNotice(noticeId, token) {
        return axios.delete(`/admin/notices/delete/${noticeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new NoticeService();
