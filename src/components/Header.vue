<template>
    <header class="headerContainer">
        <div class="logoContainer">
            <img src="/img/logo2.png" alt="Logo" class="logo" @click="goHome" />
        </div>

        <div class="hamburger" @click="toggleMobileMenu">
            <i class="fas fa-bars"></i>
        </div>

        <nav class="navContainer" :class="{ open: isMobileMenuOpen }">
            <ul class="navList">
                <li class="menuItem">
                    <a>제품</a>
                    <ul class="subMenu">
                        <!-- <li @click="closeMobileMenu">
                            <RouterLink to="/products/essential">에센셜 오일</RouterLink>
                        </li> -->
                        <li @click="closeMobileMenu">
                            <RouterLink to="/products/onlymember">에센셜 오일</RouterLink>
                        </li>
                        <li @click="closeMobileMenu"><RouterLink to="/products/kits">키트 상품</RouterLink></li>
                    </ul>
                </li>
                <li class="menuItem">
                    <a>회사소개</a>
                    <ul class="subMenu">
                        <li @click="closeMobileMenu"><RouterLink to="/about/greeting">인사말</RouterLink></li>
                        <li @click="closeMobileMenu"><RouterLink to="/about/story">브랜드 스토리</RouterLink></li>
                        <li @click="closeMobileMenu">
                            <RouterLink to="/about/navigate">찾아오시는 길</RouterLink>
                        </li>
                    </ul>
                </li>
                <li class="menuItem">
                    <a>비즈니스</a>
                    <ul class="subMenu">
                        <li @click="closeMobileMenu"><RouterLink to="/business/events">행사/이벤트</RouterLink></li>
                        <li @click="closeMobileMenu"><RouterLink to="/business/lectures">강의자료</RouterLink></li>
                    </ul>
                </li>
                <li @click="closeMobileMenu" class="menuItem"><RouterLink to="/notices">공지사항</RouterLink></li>
                <li @click="closeMobileMenu" class="menuItem"><RouterLink to="/qna">QnA</RouterLink></li>
            </ul>
        </nav>

        <div class="authMenuContainer">
            <div class="authContainer" @click="goCart">
                <div class="normalIcon cart"></div>
                <span class="cartText">장바구니 </span>
            </div>
            <div class="authContainer" @click="toggleAuthMenu">
                <div class="normalIcon login"></div>
                <span class="loginText">
                    {{ isAuthenticated ? userName + "님" : "로그인" }}
                </span>
                <div v-show="showAuthMenu" class="authMenu">
                    <p class="authWelcome">
                        {{ isAuthenticated ? userName + "님, 환영합니다." : "카리나벨에 오신 것을 환영합니다!" }}
                    </p>
                    <p v-if="isAuthenticated" class="authWelcome">
                        {{ "회원등급 : " + userMembershipLevel }}
                    </p>
                    <button v-if="!isAuthenticated" class="authLoginButton" @click="goLogin">로그인</button>
                    <button v-if="!isAuthenticated" class="authSignupButton" @click="goSignup">회원가입</button>
                    <button v-if="isAuthenticated" class="myPageButton" @click="goMypage">마이페이지</button>
                    <button v-if="isAuthenticated" class="authLogoutButton" @click="handleLogout">로그아웃</button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import { onMounted } from "vue";

const showAuthMenu = ref(false);
const store = useStore();
const isMobileMenuOpen = ref(false);
const isAuthenticated = computed(() => store.getters.isAuthenticated);
const userName = computed(() => store.getters.userName);
const userMembershipLevel = computed(() => store.getters.membershipLevel);

const goHome = () => {
    router.push({ path: "/" });
};
const goLogin = () => {
    router.push({ path: "/login" });
};
const goSignup = () => {
    router.push({ path: "/signup" });
};
const goCart = () => {
    router.push({ path: "/cart" });
};
const goMypage = () => {
    router.push({ path: "/myPage" });
};

const toggleAuthMenu = () => {
    showAuthMenu.value = !showAuthMenu.value;
};
const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

const handleLogout = () => {
    store.dispatch("logout");
    alert("로그아웃 되었습니다.");
    router.push("/");
    toggleAuthMenu();
};

onMounted(() => {
    console.log("회원등급 :", store.getters.membershipLevel);
});
</script>
<style scoped>
.headerContainer {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    background-color: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    z-index: 1000;
}

.logoContainer .logo {
    height: 80px;
    width: 180px;
    cursor: pointer;
}

.navContainer .navList {
    display: flex;
    gap: 2rem;
    animation: fadeIn 0.3s ease;
}

.menuItem {
    position: relative;
    list-style: none;
    padding: 1rem 0;
}

.menuItem a {
    font-weight: 600;
    color: #333;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    padding: 1rem 1.5rem;
    display: block;
}

.menuItem a:hover {
    color: #cc8a94;
}

.menuItem:hover .subMenu,
.subMenu:hover {
    visibility: visible;
    opacity: 1;
}

.subMenu {
    position: absolute;
    background-color: #ffffff;
    border-radius: 0.25rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    margin-top: 0.5rem;
    padding: 0.5rem 0;
    min-width: 160px;
    z-index: 999;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.2s ease-in-out;
}

.subMenu li {
    list-style: none;
}

.subMenu li a {
    padding: 0.5rem 1.5rem;
    color: #333;
    display: block;
    text-decoration: none;
    transition: background-color 0.2s ease-in-out;
}

.subMenu li a:hover {
    background-color: #f0f0f0;
    color: #cc8a94;
    border-left: 3px solid #cc8a94;
}
.authMenuContainer {
    width: 160px;
    display: flex;
    justify-content: space-between;
}
.authContainer {
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.loginIcon {
    height: 24px;
    margin-right: 0.5rem;
}

.loginText {
    font-weight: 600;
    /* color: #cc8a94; */
    margin-top: 0.4rem;
}

.cartText {
    font-weight: 600;
    margin-top: 0.4rem;
}
.authContainer:hover .cartText,
.authContainer:hover .loginText {
    color: #cc8a94;
}

.authMenu {
    position: absolute;
    top: 50px;
    right: 0;
    background-color: #ffffff;
    padding: 1.5rem;
    border-radius: 1.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    width: 320px;
}

.authWelcome {
    font-weight: 700;
    color: #333;
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1rem;
}

.authWelcome:first-child {
    margin-bottom: 0.4rem;
}

.authLoginButton {
    width: 100%;
    padding: 0.75rem;
    background-color: #ffffff;
    color: #cc8a94;
    border: 2px solid #cc8a94;
    border-radius: 30px;
    font-weight: 700;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.authLoginButton:hover {
    background-color: #f4f4f4;
}

.authSignupButton {
    width: 100%;
    padding: 0.75rem;
    background-color: #cc8a94;
    color: #ffffff;
    border: none;
    border-radius: 30px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.authSignupButton:hover {
    background-color: #cc8a94;
}
.authLogoutButton,
.myPageButton {
    width: 100%;
    padding: 0.75rem;
    background-color: #ffffff;
    color: #cc8a94;
    border: 2px solid #cc8a94;
    border-radius: 30px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.authLogoutButton:hover,
.myPageButton:hover {
    background-color: #f4f4f4;
}

.myPageButton {
    margin-bottom: 0.8rem;
}

.hamburger {
    display: none;
    font-size: 1.8rem;
    color: #333;
    cursor: pointer;
}

@media (max-width: 1200px) {
    .menuItem {
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 0.8rem;
    }
    .menuItem:last-child {
        border: none;
    }
    .navContainer {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background-color: #fff;
        width: 100%;
        padding: 0rem 2rem;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        flex-direction: column;
    }

    .navContainer.open {
        display: flex;
    }

    .hamburger {
        display: block;
    }

    .navList {
        flex-direction: column;
        gap: 1rem;
    }
    .navContainer .navList {
        gap: 0;
    }
    .menuItem .subMenu {
        position: static;
        box-shadow: none;
        margin-top: 0.5rem;
        padding-left: 1rem;
        opacity: 1 !important;
        visibility: visible !important;
    }
}
</style>
