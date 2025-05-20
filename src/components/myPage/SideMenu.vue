<template>
    <aside :class="['sideMenu', { collapsed }]">
        <div class="toggleButton" @click="$emit('toggle-collapse')">
            <i class="fa-solid fa-bars"></i>
        </div>
        <nav>
            <ul>
                <li
                    v-for="menu in menus"
                    :key="menu.name"
                    @click="navigate(menu.link)"
                >
                    <i :class="menu.icon"></i>
                    <span v-if="!collapsed">{{ menu.name }}</span>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup>
import { useRouter } from "vue-router";
defineProps({ collapsed: Boolean });
const router = useRouter();
const navigate = (link) => router.push(link);

const menus = [
    { name: "정보 관리", link: "/mypage/info", icon: "fa-solid fa-user" },
    { name: "회원 관리", link: "/mypage/members", icon: "fa-solid fa-users" },
    { name: "주문 관리", link: "/mypage/orders", icon: "fa-solid fa-box" },
    { name: "수당 관리", link: "/mypage/referral", icon: "fa-solid fa-coins" },
    { name: "배송지 관리", link: "/mypage/address", icon: "fa-solid fa-truck" },
    {
        name: "주문 내역",
        link: "/mypage/order-history",
        icon: "fa-solid fa-receipt",
    },
    {
        name: "문의 내역",
        link: "/mypage/inquiries",
        icon: "fa-solid fa-question-circle",
    },
];
</script>

<style scoped>
.sideMenu {
    width: 240px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 30px 20px;
    position: sticky;
    top: 30px;
    height: fit-content;
    transition: all 0.3s ease;
}

/* 사이드 메뉴가 접혔을 때 스타일 */
.sideMenu.collapsed {
    width: 80px;
    padding: 30px 10px;
}

/* 사이드 메뉴 오른쪽에 뜨는 버튼 */
.toggleButton {
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #cc8a94;
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s;
}

.toggleButton:hover {
    background-color: #ca717f;
}
.nav ul {
    list-style: none;
    padding: 0;
}

nav li {
    height: 48px;
    font-size: 16px;
    color: #444;
    padding: 12px 10px;
    cursor: pointer;
    border-radius: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    transition: background-color 0.2s;
}

nav li:hover {
    background-color: #f0e1e3;
    color: #cc8a94;
}

nav i {
    margin-right: 10px;
    min-width: 20px;
    text-align: center;
}

.sideMenu.collapsed nav li {
    justify-content: center;
}

.sideMenu.collapsed nav i {
    margin-right: 0;
}
</style>
