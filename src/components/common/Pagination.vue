<template>
    <div class="pagination">
        <button
            class="pageBtn"
            :disabled="props.currentPage === 1"
            @click="goToFirstGroup"
        >
            <i class="fas fa-angle-double-left"></i>
        </button>

        <button
            class="pageBtn"
            :disabled="props.currentPage === 1"
            @click="goToPrevPage"
        >
            <i class="fas fa-angle-left"></i>
        </button>

        <button
            v-for="page in visiblePages"
            :key="page"
            :class="['pageBtn', { active: page === currentPage }]"
            @click="$emit('page-change', page)"
        >
            {{ page }}
        </button>

        <button
            class="pageBtn"
            :disabled="props.currentPage === props.totalPages"
            @click="goToNextPage"
        >
            <i class="fas fa-angle-right"></i>
        </button>

        <button
            class="pageBtn"
            :disabled="props.currentPage === props.totalPages"
            @click="goToLastGroup"
        >
            <i class="fas fa-angle-double-right"></i>
        </button>
    </div>
</template>

<script setup>
import { computed, watch, ref } from "vue";

const props = defineProps({
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
});
const emit = defineEmits(["page-change"]);

const groupSize = 5;
const currentGroup = ref(Math.ceil(props.currentPage / groupSize));

watch(
    () => props.currentPage,
    (val) => {
        currentGroup.value = Math.ceil(val / groupSize);
    }
);

const startPage = computed(() => (currentGroup.value - 1) * groupSize + 1);
const endPage = computed(() =>
    Math.min(startPage.value + groupSize - 1, props.totalPages)
);

const visiblePages = computed(() => {
    const pages = [];
    for (let i = startPage.value; i <= endPage.value; i++) {
        pages.push(i);
    }
    return pages;
});

const prevGroup = () => {
    if (currentGroup.value > 1) {
        currentGroup.value--;
        emit("page-change", (currentGroup.value - 1) * groupSize + 1);
    }
};

const nextGroup = () => {
    if (endPage.value < props.totalPages) {
        currentGroup.value++;
        emit("page-change", (currentGroup.value - 1) * groupSize + 1);
    }
};
const goToPrevPage = () => {
    if (props.currentPage > 1) {
        emit("page-change", props.currentPage - 1);
    }
};

const goToNextPage = () => {
    if (props.currentPage < props.totalPages) {
        emit("page-change", props.currentPage + 1);
    }
};
const goToFirstGroup = () => {
    currentGroup.value = 1;
    emit("page-change", 1);
};

const goToLastGroup = () => {
    const lastPage = props.totalPages;
    currentGroup.value = Math.ceil(lastPage / groupSize);
    emit("page-change", lastPage);
};
</script>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-top: 38px;
}
.pageBtn {
    padding: 0;
    font-size: 12px;
    border: 1px solid transparent;
    border-radius: 0;
    cursor: pointer;
    background-color: #fff;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 34px;
    height: 34px;
}
.pageBtn i {
    font-size: 14px;
}
.pageBtn.active {
    background-color: var(--color-brand-dark, #563f4c);
    color: white;
}
.pageBtn:hover:not(:disabled):not(.active) { border-color: var(--color-line, #e9e2df); color: var(--color-brand, #866577); }
.pageBtn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
