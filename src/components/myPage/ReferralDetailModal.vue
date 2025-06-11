<template>
    <div v-if="visible" class="modalBackdrop">
        <div class="modalContent">
            <h3>{{ yearMonth }} 수당 상세</h3>
            <!-- ✅ 스크롤 전용 wrapper -->
            <div class="scrollContainer">
                <ul v-if="records.length">
                    <li v-for="(record, index) in records" :key="index">
                        <div class="detailTop">
                            <span class="name"
                                >{{ record.referredUserId.fullName }} ({{ record.referredUserId.memberId }})</span
                            >&nbsp;
                            <span class="amount">{{ formatPrice(record.amount) }}원 ({{ record.percentage }}%)</span>
                        </div>
                        <div class="detailBottom">
                            <span class="date">📅 {{ formatDate(record.date) }}</span>
                            <span class="first" v-if="record.firstPurchase"> (첫 구매)</span>
                        </div>
                    </li>
                </ul>
                <p v-else>📭 수당 기록이 없습니다.</p>
            </div>
            <button @click="close">닫기</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(["visible", "yearMonth", "records"]);
const emit = defineEmits(["close"]);
const close = () => emit("close");
const formatDate = (isoString) => {
    const d = new Date(isoString);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};
const formatPrice = (n) => n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
</script>

<style scoped>
.modalBackdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modalContent {
    background: white;
    border-radius: 20px;
    padding: 30px 40px;
    width: 560px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease;
    position: relative;
}

.modalContent h3 {
    font-size: 22px;
    margin-bottom: 20px;
    color: #cc8a94;
    border-bottom: 2px solid #f2f2f2;
    padding-bottom: 10px;
}

.modalContent ul {
    padding: 0;
    margin: 0;
    list-style: none;
}

.modalContent li {
    margin-bottom: 12px;
    padding: 10px 14px;
    border-radius: 10px;
    background-color: #f9f9f9;
    font-size: 15px;
    color: #444;
    border-left: 4px solid #cc8a94;
}

.modalContent button {
    margin-top: 24px;
    width: 100%;
    padding: 12px 0;
    background-color: #cc8a94;
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s ease;
}

.modalContent button:hover {
    background-color: #ca717f;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.scrollContainer {
    max-height: 360px;
    overflow-y: auto;
    padding-right: 6px;
}

/* 스크롤바 스타일 */
.scrollContainer::-webkit-scrollbar {
    width: 8px;
}

.scrollContainer::-webkit-scrollbar-thumb {
    background-color: #cc8a94;
    border-radius: 4px;
}

.scrollContainer::-webkit-scrollbar-track {
    background-color: #f3f3f3;
    border-radius: 4px;
}
</style>
