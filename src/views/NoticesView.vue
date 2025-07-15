<template>
    <div class="noticePage">
        <h2 class="pageTitle themaColor2">공지사항</h2>

        <ul class="noticeList">
            <li
                v-for="notice in noticeList"
                :key="notice._id"
                class="noticeItem"
                @click="goToDetail(notice._id)"
            >
                <div class="noticeContent">
                    <h3 class="noticeTitle">{{ notice.title }}</h3>
                    <p class="noticeSummary">{{ notice.summary }}</p>
                </div>
                <span class="noticeDate">{{ notice.date }}</span>
            </li>
        </ul>

        <!-- 페이지네이션 -->
        <Pagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import NoticeService from "@/api/NoticeService";
import Pagination from "@/components/common/Pagination.vue";

const router = useRouter();
const store = useStore();
const token = store.state.token.token;

const noticeList = ref([]);
const currentPage = ref(1);
const pageSize = 5;
const totalPages = ref(1);

// 공지사항 목록 불러오기
const fetchNotices = () => {
    const query = {
        page: currentPage.value - 1, // 서버는 0부터 시작
        size: pageSize,
    };

    NoticeService.getNoticeList(query, token)
        .then((res) => {
            noticeList.value = res.data.notices;
            totalPages.value = Math.ceil(res.data.total / pageSize);
        })
        .catch((err) => {
            console.error("❌ 공지사항 목록 불러오기 실패:", err);
            noticeList.value = [];
            totalPages.value = 1;
        });
};

// 페이지 변경 핸들러
const handlePageChange = (newPage) => {
    currentPage.value = newPage;
    fetchNotices();
};

// 상세 페이지 이동
const goToDetail = (id) => {
    router.push(`/notice/${id}`);
};

onMounted(() => {
    fetchNotices();
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
    white-space: nowrap;
}

/* ✅ 페이지네이션 */
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

/* ✅ 반응형: 태블릿 이하 (≤1200px) */
@media (max-width: 1200px) {
    .noticePage {
        padding: 24px;
    }

    .noticeItem {
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
    }

    .noticeDate {
        margin-left: 0;
        margin-top: 10px;
        font-size: 12px;
    }

    .pageTitle {
        font-size: 24px;
    }
}

/* ✅ 반응형: 모바일 이하 (≤600px) */
@media (max-width: 600px) {
    .noticePage {
        padding: 16px;
    }

    .noticeItem {
        padding: 14px;
        border-radius: 8px;
    }

    .noticeTitle {
        font-size: 16px;
    }

    .noticeSummary {
        font-size: 13px;
    }

    .noticeDate {
        font-size: 12px;
    }

    .pageBtn {
        padding: 8px 14px;
        font-size: 13px;
    }

    .paginationWrapper {
        flex-direction: column;
        gap: 12px;
    }
}
</style>
