<template>
    <Transition name="top-fade"><button v-show="showTopButton" class="scrollTopButton" type="button" aria-label="페이지 맨 위로 이동" @click="scrollToTop"><i class="fa-solid fa-arrow-up"></i><span>TOP</span></button></Transition>
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    background-color: var(--color-brand-dark);
    color: #fff;
    font-size: 12px;
    text-align: center;
    border: 0;
    cursor: pointer;
    z-index: 999;
    box-shadow: 0 8px 24px rgba(50, 35, 43, 0.2);
    transition: opacity 0.3s, background-color 0.3s;
    outline: none;
}

.scrollTopButton:hover {
    background-color: var(--color-brand);
}
.scrollTopButton i{font-size:10px}.scrollTopButton span{font-size:9px;letter-spacing:.08em}.top-fade-enter-active,.top-fade-leave-active{transition:.2s}.top-fade-enter-from,.top-fade-leave-to{opacity:0;transform:translateY(8px)}

@media (max-width: 600px) {
    .scrollTopButton {
        right: 16px;
        bottom: 16px;
        width: 44px;
        height: 44px;
    }
}
</style>
