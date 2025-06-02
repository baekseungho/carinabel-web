import axios from "./axios";

const API_URL = "/qna";

class QnaService {
    // 전체 목록 가져오기 (카테고리 및 검색 조건 포함)
    getQnaList(params, token) {
        return axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params, // ← GET 요청에서는 이렇게 필터링 데이터를 전달해야 함
        });
    }
    // QnA 상세 조회
    getQnaDetail(qnaId, token) {
        return axios.get(`${API_URL}/${qnaId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // QnA 작성
    createQna(qnaData, token) {
        return axios.post(API_URL, qnaData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // QnA 수정
    updateQna(qnaId, qnaData, token) {
        return axios.put(`${API_URL}/${qnaId}`, qnaData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // QnA 삭제
    deleteQna(qnaId, token) {
        return axios.delete(`${API_URL}/${qnaId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    getMyQnaList(userId, token) {
        return axios.get(`${API_URL}/my`, {
            params: { userId },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    getMyQnaListWithPaging(query, token) {
        return axios.get(`${API_URL}/my`, {
            params: query,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new QnaService();
