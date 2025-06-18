<template>
    <Header v-if="!hideHeaderFooter" />
    <div class="content">
        <router-view />
    </div>
    <Footer v-if="!hideHeaderFooter" />
    <ScrollToTopButton />
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import ScrollToTopButton from "./components/ui/ScrollToTopButton.vue";

const route = useRoute();
const hideHeaderFooter = ref(route.meta.hideHeaderFooter || false);

watch(route, (newRoute) => {
    hideHeaderFooter.value = newRoute.meta.hideHeaderFooter || false;
});
</script>
<style scoped>
.content {
    min-height: 780px;
}
</style>
