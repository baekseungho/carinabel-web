<template>
    <button v-show="showTopButton" class="scrollTopButton" @click="scrollToTop">▲<br />TOP</button>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const showTopButton = ref(false);

function handleScroll() {
    showTopButton.value = window.scrollY > 300;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.scrollTopButton {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #cc8a94;
    color: #fff;
    font-size: 12px;
    text-align: center;
    border: 1px solid #ddd;
    cursor: pointer;
    z-index: 999;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s, background-color 0.3s;
    outline: none;
}

.scrollTopButton:hover {
    background-color: #ca717f;
}
</style>
