import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import Login from "@/views/LoginView.vue";
import ProductView from "@/views/ProductView.vue";
import ProductDetail from "@/views/ProductDetail.vue";
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";
import Greeting from "@/views/GreetingView.vue";
import Story from "@/views/StoryView.vue";
import Events from "@/views/EventsView.vue";
import Lectures from "@/views/LecturesView.vue";
import QnA from "@/views/QnAView.vue";
import Notices from "@/views/NoticesView.vue";

const routes = [
    { path: "/", name: "Home", component: HomeView },
    { path: "/login", name: "Login", component: Login },
    { path: "/products", name: "Products", component: ProductView },
    { path: "/products/:id", name: "ProductDetail", component: ProductDetail },
    { path: "/about/greeting", name: "Greeting", component: Greeting },
    { path: "/about/story", name: "Story", component: Story },
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
    if (to.meta.maintenance) {
        alert("서비스 준비중입니다.");
        // next(false);
        router.push({ path: "/" }); // 접근 차단
    } else {
        next(); // 접근 허용
    }
});

export default router;
