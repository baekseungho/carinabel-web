<template>
  <div class="noticePage">
    <h2 class="pageTitle themaColor2">공지사항</h2>

    <ul class="noticeList">
      <li
        v-for="notice in currentNotices"
        :key="notice.id"
        class="noticeItem"
        @click="goToDetail(notice.id)"
      >
        <div class="noticeContent">
          <h3 class="noticeTitle">{{ notice.title }}</h3>
          <p class="noticeSummary">{{ notice.summary }}</p>
        </div>
        <span class="noticeDate">{{ notice.date }}</span>
      </li>
    </ul>

    <div class="paginationWrapper">
      <button @click="prevPage" :disabled="currentPage === 1" class="pageBtn">
        « Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="pageBtn"
      >
        Next »
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const notices = ref([
  { id: 1, title: "공지사항 1", summary: "내용 요약 1", date: "2025-05-19" },
  { id: 2, title: "공지사항 2", summary: "내용 요약 2", date: "2025-05-18" },
  { id: 3, title: "공지사항 3", summary: "내용 요약 3", date: "2025-05-17" },
  { id: 4, title: "공지사항 4", summary: "내용 요약 4", date: "2025-05-16" },
  { id: 5, title: "공지사항 5", summary: "내용 요약 5", date: "2025-05-15" },
  { id: 6, title: "공지사항 6", summary: "내용 요약 6", date: "2025-05-14" },
]);

const currentPage = ref(1);
const itemsPerPage = 5;
const totalPages = computed(() =>
  Math.ceil(notices.value.length / itemsPerPage)
);
const router = useRouter();

function goToDetail(id) {
  router.push(`/notice/${id}`);
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
const currentNotices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return notices.value.slice(start, start + itemsPerPage);
});
</script>

<style scoped>
.noticePage {
  padding: 32px;
  max-width: 1000px;
  margin: 0 auto;
  background: #fefefe;
}
.pageTitle {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 28px;
  border-bottom: 2px solid #cc8a94;
  padding-bottom: 12px;
}
.noticeList {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}
.noticeItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 10px;
  border: 1px solid #eee;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
}
.noticeItem:hover {
  background-color: #faf0f3;
}
.noticeContent {
  flex: 1;
}
.noticeTitle {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #604b6e;
}
.noticeSummary {
  font-size: 14px;
  color: #777;
}
.noticeDate {
  font-size: 13px;
  color: #aaa;
  margin-left: 20px;
}
.paginationWrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 10px;
}
.pageBtn {
  background-color: #cc8a94;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.pageBtn:hover {
  background-color: #ca717f;
}
.pageBtn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>
