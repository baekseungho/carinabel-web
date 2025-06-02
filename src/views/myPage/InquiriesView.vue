<template>
    <div class="myInquiriesPage">
        <h2 class="pageTitle">내 문의 내역</h2>

        <div v-if="qnaList.length === 0" class="emptyState">아직 등록한 문의가 없습니다.</div>

        <ul class="qnaList" v-else>
            <li v-for="qna in qnaList" :key="qna._id" class="qnaItem" @click="goToDetail(qna._id)">
                <div class="qnaItemHeader">
                    <span class="qnaCategory">[{{ qna.category }}]</span>
                    <span class="qnaTitle">
                        {{ qna.title }}
                        <span v-if="qna.answer?.content" class="answeredTag">[답변완료]</span>
                    </span>
                </div>
                <div class="qnaItemMeta">
                    <span>{{ formatDate(qna.createdAt) }}</span>
                    <span class="views">조회수: {{ qna.views }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import QnaService from "@/api/QnaService";

const router = useRouter();
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
const qnaList = ref([]);

const fetchMyInquiries = () => {
    if (!user?._id) return;

    QnaService.getMyQnaList(user._id, token)
        .then((res) => {
            qnaList.value = res.data;
        })
        .catch((err) => {
            console.error("❌ 내 문의내역 조회 실패:", err);
        });
};

const goToDetail = (id) => {
    router.push({ params: { id: id }, name: "QnADetail" });
};

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}`;
};

onMounted(fetchMyInquiries);
</script>

<style scoped>
.myInquiriesPage {
    padding: 20px 30px;
    animation: fadeIn 0.5s ease;
    margin: 0 auto;
}
.pageTitle {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 24px;
    color: #333;
    /* text-align: center; */
}
.emptyState {
    text-align: center;
    font-size: 16px;
    color: #777;
    padding: 40px 0;
}
.qnaList {
    list-style: none;
    padding: 0;
    margin: 0;
}
.qnaItem {
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 16px;
    cursor: pointer;
    background-color: #fff;
    transition: box-shadow 0.3s ease;
}
.qnaItem:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.qnaItemHeader {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}
.qnaCategory {
    font-weight: bold;
    color: #cc8a94;
}
.qnaTitle {
    font-size: 17px;
    font-weight: 500;
    color: #333;
}
.answeredTag {
    margin-left: 8px;
    color: #4caf50;
    font-size: 14px;
    font-weight: bold;
}
.qnaItemMeta {
    font-size: 13px;
    color: #888;
    display: flex;
    justify-content: space-between;
}
.views {
    font-style: italic;
}
</style>
