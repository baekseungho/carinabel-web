<template>
    <a class="skip-link" href="#main-content">본문 바로가기</a>
    <div v-if="!isOnline" class="network-banner" role="status">
        <i class="fa-solid fa-wifi"></i> 인터넷 연결이 끊겼습니다. 연결되면 자동으로 다시 이용할 수 있습니다.
    </div>
    <Header v-if="!hideHeaderFooter" />
    <div id="main-content" ref="mainContent" class="content" tabindex="-1">
        <RouterView v-slot="{ Component, route: currentRoute }">
            <Transition name="page-fade" mode="out-in">
                <component :is="Component" :key="currentRoute.path" />
            </Transition>
        </RouterView>
    </div>
    <Footer v-if="!hideHeaderFooter" />
    <ScrollToTopButton />
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import ScrollToTopButton from "./components/ui/ScrollToTopButton.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();
const hideHeaderFooter = ref(route.meta.hideHeaderFooter || false);
const mainContent = ref(null);
const isOnline = ref(typeof navigator === "undefined" ? true : navigator.onLine);
const updateOnlineStatus = () => { isOnline.value = navigator.onLine; };
const handleAuthExpired = () => {
    store.dispatch("logout");
    const isAdminPage = route.path.startsWith("/admin");
    const targetName = isAdminPage ? "AdminLoginView" : "Login";
    if (route.name !== targetName) router.replace({ name: targetName, query: { redirect: route.fullPath, reason: "expired" } });
};

watch(route, (newRoute) => {
    hideHeaderFooter.value = newRoute.meta.hideHeaderFooter || false;
    nextTick(() => mainContent.value?.focus({ preventScroll: true }));
});

onMounted(() => {
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    window.addEventListener("auth-expired", handleAuthExpired);
});
onBeforeUnmount(() => {
    window.removeEventListener("online", updateOnlineStatus);
    window.removeEventListener("offline", updateOnlineStatus);
    window.removeEventListener("auth-expired", handleAuthExpired);
});
</script>
<style>
.content {
    min-height: 70vh;
    outline: none;
}
.skip-link { position: fixed; top: 8px; left: 8px; z-index: 9999; padding: 10px 16px; color: #fff; background: var(--color-brand-dark); transform: translateY(-150%); transition: transform .2s; }
.skip-link:focus { transform: translateY(0); }
.network-banner { position:relative;z-index:1100;padding:9px 20px;color:#fff;background:#473b41;text-align:center;font-size:.74rem; }
.network-banner i { margin-right:7px;color:#e3b8bd; }
.page-fade-enter-active,.page-fade-leave-active { transition:opacity .18s ease,transform .18s ease; }
.page-fade-enter-from { opacity:0;transform:translateY(5px); }
.page-fade-leave-to { opacity:0; }
</style>
