<template>
    <div class="pageContainer">
        <div class="pageHeader">
            <h1>마이페이지</h1>
            <p>나의 추천 및 구매 현황을 한눈에 확인해보세요.</p>
        </div>

        <RecommendationTable />
    </div>
</template>

<script setup>
import RecommendationTable from "@/components/myPage/RecommendationTable.vue";
</script>

<style scoped>
.pageContainer {
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.5s ease;
}

.pageHeader {
    border-bottom: 2px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 30px;
}

.pageHeader h1 {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 6px;
}

.pageHeader p {
    font-size: 16px;
    color: #999;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
