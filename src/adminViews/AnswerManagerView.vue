<template>
  <div class="adminQnaPage">
    <h2 class="pageTitle">Q&A 관리</h2>

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
        <tr
          v-for="(item, index) in qnaList"
          :key="item._id"
          @click="viewDetail(item)"
          class="clickableRow"
        >
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
        <textarea
          v-model="answerContent"
          rows="6"
          placeholder="답변 내용을 입력하세요"
        ></textarea>
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
        if (!!a.hasAnswer === !!b.hasAnswer)
          return new Date(b.createdAt) - new Date(a.createdAt);
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
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

onMounted(fetchQnaList);
</script>

<style scoped>
.adminQnaPage {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}
.pageTitle {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
}
.qnaTable {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 32px;
}
.qnaTable th,
.qnaTable td {
  border: 1px solid #ccc;
  padding: 12px;
  text-align: left;
}
.clickableRow {
  cursor: pointer;
}
.qnaDetail {
  border-top: 2px solid #999;
  padding-top: 24px;
}
.answerForm {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.answerForm textarea {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
}
.answerForm button {
  align-self: flex-end;
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
