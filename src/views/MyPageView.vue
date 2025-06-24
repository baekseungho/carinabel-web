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
    padding-left: 40px; /* 펼쳤을 때 사이드바 넓이만큼 */
}

.myPageMain.collapsed {
    padding-left: 40px; /* 접혔을 때 좁게 */
}

/* ✅ 모바일 (600px 이하)에서는 하단 메뉴바 고려하여 padding-bottom 설정 */
@media (max-width: 600px) {
    .myPageWrapper {
        flex-direction: column; /* 필요시 세로 정렬도 가능 */
        padding: 20px 10px 80px 10px; /* 하단 네비 높이 고려 padding-bottom */
    }

    .myPageMain,
    .myPageMain.collapsed {
        padding-left: 0; /* 모바일에서는 좌측 여백 제거 */
    }
}
</style>
