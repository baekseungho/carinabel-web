<template>
    <div class="pagination">
        <button class="pageBtn" :disabled="currentPage === 1" @click="$emit('update:currentPage', currentPage - 1)">
            ‹ 이전
        </button>

        <button
            v-for="page in visiblePages"
            :key="page"
            :class="['pageBtn', { active: page === currentPage }]"
            @click="$emit('update:currentPage', page)"
        >
            {{ page }}
        </button>

        <button
            class="pageBtn"
            :disabled="currentPage === totalPages"
            @click="$emit('update:currentPage', currentPage + 1)"
        >
            다음 ›
        </button>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
});

const visiblePages = computed(() => {
    const pages = [];
    const range = 2; // currentPage 기준 좌우 range 만큼 표시
    const start = Math.max(1, props.currentPage - range);
    const end = Math.min(props.totalPages, props.currentPage + range);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});
</script>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 24px;
}
.pageBtn {
    padding: 8px 14px;
    font-size: 14px;
    border: none;
    border-radius: 6px;
    background-color: #f1f1f1;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;
}
.pageBtn:hover:not(:disabled) {
    background-color: #ddd;
}
.pageBtn.active {
    background-color: #cc8a94;
    color: #fff;
    font-weight: bold;
}
.pageBtn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
