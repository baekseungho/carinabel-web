<template>
    <Header v-if="!isLoginPage" />
    <div>
        <router-view />
    </div>
    <Footer v-if="!isLoginPage" />
    <ScrollToTopButton />
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import ScrollToTopButton from "./components/ui/ScrollToTopButton.vue";

const route = useRoute();
const isLoginPage = ref(route.path === "/login" || route.path === "/signup");

watch(route, (newRoute) => {
    isLoginPage.value = newRoute.path === "/login" || newRoute.path === "/signup";
});
</script>

<style scoped></style>
