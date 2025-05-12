<template>
    <img :src="src" :alt="alt" class="card-image" />
</template>

<script setup>
defineProps({
    src: {
        type: String,
        required: true,
    },
    alt: {
        type: String,
        required: true,
    },
});
</script>

<style scoped>
.card-image {
    width: 100%;
    height: 200px;
    object-fit: contain; /* 이미지를 비율에 맞게 전체 표시 */
    border-radius: 12px;
    background-color: #f7f7f7;
}
</style>
