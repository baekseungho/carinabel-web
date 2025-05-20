<template>
    <div class="recommendTable">
        <div class="header">
            <h2>📊 추천 및 수당 통계</h2>
            <p class="sub">
                ※ 추천 기준일은 <strong>2022년 2월 7일</strong> 이후, 구매
                기준일은 <strong>2022년 1월 25일</strong> 이후입니다.
            </p>
        </div>

        <table v-if="stats">
            <thead>
                <tr>
                    <th>년월</th>
                    <th>당월 신규 추천인 수</th>
                    <th>총 추천인 수</th>
                    <th>당월 수당 금액</th>
                    <th>총 수당 누적 금액</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ stats.yearMonth }}</td>
                    <td>{{ stats.monthlyRefCount }}명</td>
                    <td>{{ stats.totalRefCount }}명</td>
                    <td>{{ formatPrice(stats.monthlyPurchase) }}원</td>
                    <td>{{ formatPrice(stats.totalPurchase) }}원</td>
                </tr>
            </tbody>
        </table>

        <div v-else class="loadingText">📡 데이터를 불러오는 중입니다...</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import UserService from "@/api/UserService";

const stats = ref(null);
const token = localStorage.getItem("token");

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

onMounted(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    UserService.getUserStats(user._id, token)
        .then((response) => {
            stats.value = response.data;
            console.log("✅ 추천 통계 로드 완료:", response.data);
        })
        .catch((error) => {
            console.error("❌ 추천 통계 로드 실패:", error);
        });
});
</script>

<style scoped>
.recommendTable {
    background-color: #fff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.5s ease;
}

.header {
    margin-bottom: 20px;
}

.header h2 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
}

.sub {
    font-size: 14px;
    color: #d9534f;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

thead {
    background-color: #333;
    color: #fff;
}

th,
td {
    padding: 14px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
}

tbody tr:hover {
    background-color: #f9f9f9;
}

.loadingText {
    text-align: center;
    padding: 30px;
    font-size: 18px;
    color: #999;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
