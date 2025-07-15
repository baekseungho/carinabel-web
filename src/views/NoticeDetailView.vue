<template>
    <div class="noticeDetailContainer">
        <div class="backButton" @click="goBack">
            <div class="back bigIcon"></div>
        </div>

        <div class="noticeDetailWrapper" v-if="notice">
            <h1>{{ notice.title }}</h1>
            <p class="noticeDate">{{ notice.date }}</p>
            <div class="noticeContent">
                <p>{{ notice.content }}</p>
            </div>
        </div>

        <div v-else class="noNoticeMessage">
            <p>공지사항을 찾을 수 없습니다.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import NoticeService from "@/api/NoticeService";

const route = useRoute();
const router = useRouter();
const store = useStore();
const token = store.state.token.token;

const notice = ref(null);

// 공지 상세 가져오기
const fetchNoticeDetail = () => {
    const id = route.params.id;

    NoticeService.getNoticeDetail(id, token)
        .then((res) => {
            notice.value = res.data;
        })
        .catch((err) => {
            console.error("❌ 공지사항 상세 조회 실패:", err);
            notice.value = null;
        });
};

const goBack = () => {
    router.push("/notices");
};

onMounted(() => {
    fetchNoticeDetail();
});
</script>
<style scoped>
.noticeDetailContainer {
    padding: 60px 30px;
    /* background-color: #fafafa; */
    display: flex;
    justify-content: center;
    position: relative;
}

.noticeDetailWrapper {
    max-width: 1000px;
    width: 100%;
    background-color: #ffffff;
    border-radius: 24px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
    padding: 48px 60px;
    position: relative;
    transition: all 0.3s ease;
}

.noticeDetailWrapper h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c2c2c;
    margin-bottom: 28px;
    border-bottom: 3px solid #cc8a94;
    padding-bottom: 14px;
}

.noticeDate {
    font-size: 1rem;
    color: #999;
    margin-bottom: 32px;
}

.noticeContent {
    font-size: 1.125rem;
    color: #444;
    line-height: 2;
    white-space: pre-line;
}

.backButton {
    position: absolute;
    top: 8px;
    left: 20px;
    background-color: transparent;
    color: #333;
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid #eee;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    z-index: 10;
}
.backButton:hover {
    background-color: #cc8a94;
    color: #fff;
}

/* ✅ 반응형: 태블릿 이하 (≤1200px) */
@media (max-width: 1200px) {
    .noticeDetailWrapper {
        padding: 40px 32px;
    }

    .noticeDetailWrapper h1 {
        font-size: 2rem;
    }

    .noticeContent {
        font-size: 1rem;
    }
    .backButton {
        top: 4px;
        left: 10px;
        padding: 4px 8px;
        font-size: 12px;
    }
}

/* ✅ 반응형: 모바일 이하 (≤600px) */
@media (max-width: 600px) {
    .noticeDetailWrapper {
        padding: 32px 20px;
        border-radius: 16px;
    }

    .noticeDetailWrapper h1 {
        font-size: 1.6rem;
        padding-bottom: 10px;
    }

    .noticeContent {
        font-size: 0.95rem;
        line-height: 1.7;
    }
}
</style>
