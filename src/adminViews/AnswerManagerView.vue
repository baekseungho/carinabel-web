<template>
    <div class="adminQnaList">
        <h1 class="pageTitle">Q&A 관리</h1>

        <table class="qnaTable">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>카테고리</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>답변여부</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in qnaList" :key="item._id" @click="viewDetail(item)" class="clickableRow">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.category }}</td>
                    <td>
                        {{ item.hasAnswer ? "[답변완료] " + item.title : item.title }}
                    </td>
                    <td>{{ item.maskedAuthor }}</td>
                    <td>{{ formatDate(item.createdAt) }}</td>
                    <td>{{ item.hasAnswer ? "완료" : "미답변" }}</td>
                </tr>
            </tbody>
        </table>

        <div v-if="selectedQna" class="qnaDetail">
            <h3>문의 내용</h3>
            <p><strong>제목:</strong> {{ selectedQna.title }}</p>
            <p><strong>내용:</strong> {{ selectedQna.content }}</p>

            <div v-if="selectedQna.hasAnswer">
                <h4>답변 내용</h4>
                <p>{{ selectedQna.hasAnswer.content }}</p>
            </div>

            <div v-else class="answerForm">
                <textarea v-model="answerContent" rows="6" placeholder="답변 내용을 입력하세요"></textarea>
                <button class="themaBgColor4" @click="submitAnswer">답변 등록</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import QnaService from "@/api/QnaService";
import AdminService from "@/api/AdminService";

const qnaList = ref([]);
const selectedQna = ref(null);
const answerContent = ref("");
const token = localStorage.getItem("token");
const admin = JSON.parse(localStorage.getItem("user"));

const fetchQnaList = () => {
    QnaService.getQnaList({}, token)
        .then((res) => {
            qnaList.value = res.data.qnas.sort((a, b) => {
                if (!!a.hasAnswer === !!b.hasAnswer) return new Date(b.createdAt) - new Date(a.createdAt);
                return a.hasAnswer ? 1 : -1;
            });
        })
        .catch((err) => console.error("❌ QnA 목록 불러오기 실패:", err));
};

const viewDetail = (qna) => {
    selectedQna.value = qna;
    answerContent.value = "";
};

const submitAnswer = () => {
    const data = {
        content: answerContent.value,
        adminId: admin._id,
    };
    AdminService.answerQna(selectedQna.value._id, data, token)
        .then(() => {
            alert("답변이 등록되었습니다.");
            fetchQnaList();
            selectedQna.value = null;
        })
        .catch((err) => console.error("❌ 답변 등록 실패:", err));
};

const formatDate = (str) => {
    const d = new Date(str);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}`;
};

onMounted(fetchQnaList);
</script>

<style scoped>
.adminQnaList {
    padding: 2rem;
    margin-left: 220px; /* 사이드바 고려 */
}

.pageTitle {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
}

.qnaTable {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
}

.qnaTable th,
.qnaTable td {
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    text-align: center;
    font-size: 0.95rem;
}

.qnaTable th {
    background-color: #f2f2f2;
    color: #333;
    font-weight: 600;
}

.clickableRow {
    cursor: pointer;
}
.clickableRow:hover {
    background-color: #ffe6ea;
}

.qnaDetail {
    border-top: 2px solid #999;
    padding-top: 1.5rem;
}

.answerForm {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.answerForm textarea {
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 15px;
    resize: vertical;
}

.answerForm button {
    /* margin: 10px; */
    padding: 10px 20px;
    align-self: flex-end;
    background-color: #cc8a94;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.answerForm button:hover {
    background-color: #a0666f;
}
</style>
