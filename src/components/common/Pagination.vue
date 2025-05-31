<template>
  <div class="pagination">
    <button
      class="pageBtn"
      :disabled="currentGroup === 1"
      @click="goToFirstGroup"
    >
      <i class="fas fa-angle-double-left"></i>
    </button>

    <button class="pageBtn" :disabled="currentGroup === 1" @click="prevGroup">
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
      :disabled="endPage >= totalPages"
      @click="nextGroup"
    >
      <i class="fas fa-angle-right"></i>
    </button>

    <button
      class="pageBtn"
      :disabled="endPage >= totalPages"
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
  const lastGroup = Math.ceil(props.totalPages / groupSize);
  currentGroup.value = lastGroup;
  emit("page-change", (lastGroup - 1) * groupSize + 1);
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 24px;
}
.pageBtn {
  padding: 8px 14px;
  font-size: 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #eee;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
}
.pageBtn i {
  font-size: 14px;
}
.pageBtn.active {
  background-color: #cc8a94;
  color: white;
}
.pageBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
