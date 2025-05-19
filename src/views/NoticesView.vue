<template>
    <div class="noticeContainer">
        <div class="noticeHeader">
            <h1>공지사항</h1>
        </div>
        <div class="noticeListWrapper">
            <ul class="noticeList">
                <li v-for="notice in currentNotices" :key="notice.id" @click="goToDetail(notice.id)" class="noticeItem">
                    <h2>{{ notice.title }}</h2>
                    <p class="noticeSummary">{{ notice.summary }}</p>
                    <span class="noticeDate">{{ notice.date }}</span>
                </li>
            </ul>
            <div class="paginationWrapper">
                <button @click="prevPage" :disabled="currentPage === 1" class="themaBgColor2">&laquo; Previous</button>
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="themaBgColor2">
                    Next &raquo;
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

// 더미 데이터 (나중에 백엔드 연동 예정)
const notices = ref([
    { id: 1, title: "공지사항 1", summary: "공지사항 내용 요약 1", date: "2025-05-19" },
    { id: 2, title: "공지사항 2", summary: "공지사항 내용 요약 2", date: "2025-05-18" },
    { id: 3, title: "공지사항 3", summary: "공지사항 내용 요약 3", date: "2025-05-17" },
    { id: 4, title: "공지사항 4", summary: "공지사항 내용 요약 4", date: "2025-05-16" },
    { id: 5, title: "공지사항 5", summary: "공지사항 내용 요약 5", date: "2025-05-15" },
    { id: 6, title: "공지사항 6", summary: "공지사항 내용 요약 6", date: "2025-05-14" },
    { id: 7, title: "공지사항 7", summary: "공지사항 내용 요약 7", date: "2025-05-13" },
    { id: 8, title: "공지사항 8", summary: "공지사항 내용 요약 8", date: "2025-05-12" },
    { id: 9, title: "공지사항 9", summary: "공지사항 내용 요약 9", date: "2025-05-11" },
    { id: 10, title: "공지사항 10", summary: "공지사항 내용 요약 10", date: "2025-05-10" },
]);

const currentPage = ref(1);
const itemsPerPage = 5;
const totalPages = Math.ceil(notices.value.length / itemsPerPage);
const router = useRouter();

function goToDetail(id) {
    router.push(`/notice/${id}`);
}

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
    if (currentPage.value < totalPages) currentPage.value++;
}

const currentNotices = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return notices.value.slice(start, start + itemsPerPage);
});
</script>

<style scoped>
.noticeContainer {
    padding: 40px 20px;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.noticeHeader {
    margin-bottom: 20px;
}
.noticeHeader h1 {
    font-size: 2.2rem;
    color: #333;
    border-bottom: 2px solid #cc8a94;
    padding-bottom: 10px;
    margin-bottom: 20px;
}
.noticeListWrapper {
    max-width: 1000px;
    width: 100%;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    padding: 20px;
}
.noticeList {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
}
.noticeItem {
    padding: 20px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    transition: background-color 0.2s;
}
.noticeItem:hover {
    background-color: #f0f0f0;
}
.noticeItem h2 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 5px;
}
.noticeItem .noticeSummary {
    font-size: 1rem;
    color: #777;
    margin-bottom: 5px;
}
.noticeItem .noticeDate {
    font-size: 0.9rem;
    color: #999;
}
.paginationWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.paginationWrapper button {
    background-color: #cc8a94;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}
.paginationWrapper button:hover {
    background-color: #ca717f;
}
.paginationWrapper button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
}
.paginationWrapper span {
    font-size: 1rem;
    color: #555;
}
</style>
