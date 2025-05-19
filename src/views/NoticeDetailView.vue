<template>
    <div class="noticeDetailContainer">
        <div class="backButton" @click="goBack">
            <div class="back bigIcon"></div>
        </div>

        <div class="noticeDetailWrapper">
            <h1>{{ notice.title }}</h1>
            <p class="noticeDate">{{ notice.date }}</p>
            <div class="noticeContent">
                <p>{{ notice.content }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const notice = ref({});

// 더미 데이터 (나중에 백엔드 연동 예정)
const notices = [
    { id: 1, title: "공지사항 1", content: "공지사항 내용 1", date: "2025-05-19" },
    { id: 2, title: "공지사항 2", content: "공지사항 내용 2", date: "2025-05-18" },
    { id: 3, title: "공지사항 3", content: "공지사항 내용 3", date: "2025-05-17" },
    { id: 4, title: "공지사항 4", content: "공지사항 내용 4", date: "2025-05-16" },
    { id: 5, title: "공지사항 5", content: "공지사항 내용 5", date: "2025-05-15" },
];

onMounted(() => {
    const id = Number(route.params.id);
    notice.value = notices.find((n) => n.id === id) || {
        title: "글을 찾을 수 없습니다",
        content: "해당 글이 존재하지 않습니다.",
        date: "",
    };
});

function goBack() {
    router.push("/notices");
}
</script>

<style scoped>
.noticeDetailContainer {
    padding: 40px 20px;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}
.noticeDetailWrapper {
    max-width: 1000px;
    width: 100%;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    padding: 40px;
    position: relative;
}
.noticeDetailWrapper h1 {
    font-size: 2.2rem;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #cc8a94;
    padding-bottom: 10px;
}
.noticeDate {
    font-size: 1rem;
    color: #777;
    margin-bottom: 20px;
}
.noticeContent {
    font-size: 1.2rem;
    color: #555;
    line-height: 1.8;
}
.backButton {
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: transparent;
    color: #333;
    padding: 10px 20px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    z-index: 10;
}
.backButton:hover {
    background-color: #cc8a94;
    color: #fff;
}
</style>
