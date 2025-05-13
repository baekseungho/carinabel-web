import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import Login from "@/views/LoginView.vue";
import Signup from "@/views/SignupView.vue";
import ProductView from "@/views/ProductView.vue";
import ProductDetail from "@/views/ProductDetail.vue";
import Onlymember from "@/views/OnlyMemberView.vue";
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";
import Greeting from "@/views/GreetingView.vue";
import Story from "@/views/StoryView.vue";
import Navigate from "@/views/NavigateView.vue";
import Events from "@/views/EventsView.vue";
import Lectures from "@/views/LecturesView.vue";
import QnA from "@/views/QnAView.vue";
import Notices from "@/views/NoticesView.vue";
import store from "@/store";

const routes = [
    { path: "/", name: "Home", component: HomeView },
    { path: "/login", name: "Login", component: Login },
    { path: "/signup", name: "Signup", component: Signup },
    { path: "/products/essential", name: "Products", component: ProductView },
    {
        path: "/products/essential/:id",
        name: "ProductDetail",
        component: ProductDetail,
    },
    {
        path: "/products/onlymember",
        name: "Onlymember",
        component: Onlymember,
        meta: {
            requiresAuth: true,
        },
    },
    { path: "/about/greeting", name: "Greeting", component: Greeting },
    { path: "/about/story", name: "Story", component: Story },
    { path: "/about/navigate", name: "Navigate", component: Navigate },
    { path: "/about", name: "About", component: AboutView },
    { path: "/contact", name: "Contact", component: ContactView },

    // ⚠️ 서비스 준비중 페이지들
    {
        path: "/business/events",
        name: "Events",
        component: Events,
        meta: { maintenance: true },
    },
    {
        path: "/business/lectures",
        name: "Lectures",
        component: Lectures,
        meta: { maintenance: true },
    },
    { path: "/qna", name: "QnA", component: QnA, meta: { maintenance: true } },
    {
        path: "/notices",
        name: "Notices",
        component: Notices,
        meta: { maintenance: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// ❗ 전역 네비게이션 가드
router.beforeEach((to, from, next) => {
    // 서비스 준비중 페이지 차단
    if (to.meta.maintenance) {
        alert("서비스 준비중입니다.");
        return next("/");
    }

    // 인증이 필요한 페이지 차단
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem("token");
        if (!token || !store.getters.isAuthenticated) {
            alert("로그인이 필요한 페이지입니다.");
            return next("/login");
        }
    }

    // 접근 허용
    next();
});

export default router;
