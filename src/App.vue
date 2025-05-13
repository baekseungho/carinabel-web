<template>
    <Header v-if="!isLoginPage" />
    <div>
        <router-view />
    </div>
    <Footer v-if="!isLoginPage" />
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const route = useRoute();
const router = useRouter();

const isLoginPage = ref(route.path === "/login");

// 라우트 변경 시 헤더/푸터 상태 업데이트
watch(route, (newRoute) => {
    isLoginPage.value = newRoute.path === "/login" || newRoute.path === "/signup";
});
</script>

<style scoped></style>
