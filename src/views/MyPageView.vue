<template>
    <div class="myPageWrapper">
        <SideMenu :collapsed="isCollapsed" @toggle-collapse="toggleCollapse" />
        <div :class="['myPageMain', { collapsed: isCollapsed }]">
            <router-view />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import SideMenu from "@/components/myPage/SideMenu.vue";

const isCollapsed = ref(false);
const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
.myPageWrapper {
    display: flex;
    min-height: 100vh;
    background-color: #f9f9f9;
    padding: 40px 20px;
}

.myPageMain {
    flex: 1;
    padding-left: 120px; /* 펼쳤을 때 사이드바 넓이만큼 */
}

.myPageMain.collapsed {
    padding-left: 80px; /* 접혔을 때 좁게 */
}
</style>
