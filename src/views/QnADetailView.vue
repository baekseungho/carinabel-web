<template>
  <div class="qnaDetailPage">
    <h2 class="pageTitle">Q&A 상세 보기</h2>

    <div class="qnaBox">
      <div class="qnaHeader">
        <span class="category">[{{ qna.category }}]</span>
        <h3 class="title">
          {{ qna.title }}
          <span v-if="qna.answer?.content" class="answeredTag">[답변완료]</span>
        </h3>
        <p class="meta">
          작성자: {{ maskedAuthor }} | 작성일: {{ formatDate(qna.createdAt) }} |
          조회수: {{ qna.views }}
        </p>
      </div>

      <div class="qnaProduct">
        <img :src="qna.imagePath || '/img/default.jpg'" alt="상품 이미지" />
        <p>{{ qna.productName }}</p>
      </div>

      <div class="qnaContent">
        <p>{{ qna.content }}</p>
      </div>
    </div>

    <div v-if="qna.answer?.content" class="answerBox">
      <h4>📌 관리자 답변</h4>
      <p class="adminMeta">답변자: {{ qna.answer.adminId?.fullName }}</p>
      <p class="answerContent">{{ qna.answer.content }}</p>
    </div>

    <button class="backBtn" @click="goBack">← 목록으로</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import QnaService from "@/api/QnaService";

const route = useRoute();
const router = useRouter();
const qna = ref({});
const maskedAuthor = ref("");

const formatDate = (str) => {
  const d = new Date(str);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

const goBack = () => {
  router.push("/qna");
};

onMounted(() => {
  QnaService.getQnaDetail(route.params.id)
    .then((res) => {
      qna.value = res.data;
      maskedAuthor.value = res.data.userId.fullName.replace(/.$/, "*");
    })
    .catch((err) => {
      console.error("❌ 게시글 불러오기 실패:", err);
    });
});
</script>

<style scoped>
.qnaDetailPage {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}
.pageTitle {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}
.qnaBox {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 24px;
  background: #fff;
}
.qnaHeader .title {
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}
.answeredTag {
  color: #4caf50;
  font-size: 14px;
  font-weight: bold;
  margin-left: 8px;
}
.qnaHeader .meta {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}
.qnaProduct {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
}
.qnaProduct img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.qnaContent {
  margin-top: 20px;
  font-size: 16px;
  line-height: 1.6;
}
.answerBox {
  margin-top: 32px;
  padding: 20px;
  border-radius: 12px;
  background-color: #f5f9f6;
  border-left: 4px solid #4caf50;
}
.answerBox h4 {
  margin: 0 0 12px;
  color: #2e7d32;
}
.adminMeta {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}
.answerContent {
  font-size: 15px;
  line-height: 1.5;
}
.backBtn {
  margin-top: 32px;
  padding: 10px 20px;
  background-color: #cc8a94;
  border: none;
  color: white;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
}
.backBtn:hover {
  background-color: #ca717f;
}
</style>
