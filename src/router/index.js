import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import Login from "@/views/LoginView.vue";
import Signup from "@/views/SignupView.vue";
import Cart from "@/views/CartView.vue";
import MyPageView from "@/views/MyPageView.vue";
import InfoView from "@/views/myPage/InfoView.vue";
import MemberManageView from "@/views/myPage/MemberManageView.vue";
import EarningStatsView from "@/views/myPage/EarningStats.vue";
import OrderManageView from "@/views/myPage/OrderManageView.vue";
import InquiriesView from "@/views/myPage/InquiriesView.vue";
import AddressView from "@/views/myPage/AddressView.vue";
import OrderHistoryView from "@/views/myPage/OrderHistoryView.vue";
import OrderHistoryDetailView from "@/views/myPage/OrderHistoryDetailView.vue";
import WithdrawView from "@/views/myPage/WithdrawView.vue";
import ProductView from "@/views/ProductView.vue";
import ProductDetail from "@/views/ProductDetail.vue";
import Onlymember from "@/views/OnlyMemberView.vue";
import OnlymemberDetail from "@/views/OnlyMemberDetailView.vue";
import OrderComplete from "@/views/OrderCompleteView.vue";
import Kit from "@/views/KitView.vue";
import KitDetail from "@/views/KitDetailView.vue";
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";
import Greeting from "@/views/GreetingView.vue";
import Story from "@/views/StoryView.vue";
import Navigate from "@/views/NavigateView.vue";
import Events from "@/views/EventsView.vue";
import Lectures from "@/views/LecturesView.vue";
import QnA from "@/views/QnAView.vue";
import QnACreate from "@/views/QnACreateView.vue";
import QnADetail from "@/views/QnADetailView.vue";
import Notices from "@/views/NoticesView.vue";
import NoticeDetail from "@/views/NoticeDetailView.vue";
import AdminLayout from "@/adminViews/AdminLayout.vue";
import AdminLoginView from "@/adminViews/AdminLoginView.vue";
import AdminCreateView from "@/adminViews/AdminCreateView.vue";
import AdminDashboardView from "@/adminViews/AdminDashboardView.vue";
import AdminMemberManageView from "@/adminViews/AdminMemberManageView.vue";
import AdminWithdrawnMemberManageView from "@/adminViews/AdminWithdrawnMemberManageView.vue";
import AdminOrderManageView from "@/adminViews/AdminOrderManageView.vue";
import DeliveryStatusView from "@/adminViews/DeliveryStatusView.vue";
import ProductManageView from "@/adminViews/ProductManagerView.vue";
import KitManageView from "@/adminViews/AdminKitManageView.vue";
import AnswerManagerView from "@/adminViews/AnswerManagerView.vue";
import AdminShippingView from "@/adminViews/AdminShippingView.vue";
import NoticeManagerView from "@/adminViews/AdminNoticeView.vue";
import AdminQnaView from "@/adminViews/AdminQnaView.vue";
import AdminReferralView from "@/adminViews/AdminReferralEarningsView.vue";

import store from "@/store";

const routes = [
    { path: "/", redirect: "/products/onlymember" },
    // { path: "/", name: "Home", component: HomeView },

    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: { hideHeaderFooter: true },
    },
    {
        path: "/signup",
        name: "Signup",
        component: Signup,
        meta: { hideHeaderFooter: true },
    },
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
        // meta: {
        //     requiresAuth: true,
        // },
    },
    {
        path: "/products/onlymember/:id",
        name: "OnlymemberDetail",
        component: OnlymemberDetail,
        // meta: {
        //     requiresAuth: true,
        // },
    },
    {
        path: "/products/kits",
        name: "Kit",
        component: Kit,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "/order-complete/:id",
        name: "OrderComplete",
        component: OrderComplete,
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: "/products/kits/:id",
        name: "KitDetail",
        component: KitDetail,
        meta: {
            requiresAuth: true,
        },
    },
    { path: "/cart", name: "Cart", component: Cart },
    {
        path: "/mypage",
        component: MyPageView, // 여기에 SideMenu 항상 존재
        children: [
            {
                path: "",
                name: "MyPageMain",
                component: () => import("@/views/myPage/MyPageMain.vue"), // 바로 위에 만든 컴포넌트
            },
            { path: "info", component: InfoView },
            { path: "members", component: MemberManageView },
            { path: "referral", component: EarningStatsView },
            { path: "orders", component: OrderManageView },
            { path: "address", component: AddressView },
            { path: "order-history", component: OrderHistoryView },
            {
                path: "order-history/:id",
                component: OrderHistoryDetailView,
                name: "OrderHistoryDetailView",
            },
            {
                path: "inquiries",
                name: "InquiriesView",
                component: InquiriesView,
            },
            {
                path: "withdraw",
                name: "WithdrawView",
                component: WithdrawView,
            },
        ],
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
    {
        path: "/qna",
        name: "QnA",
        component: QnA,
    },
    { path: "/qna/create", name: "QnACreate", component: QnACreate },
    { path: "/qna/:id", name: "QnADetail", component: QnADetail },
    {
        path: "/notices",
        name: "Notices",
        component: Notices,
        // meta: { maintenance: true },
    },
    {
        path: "/notice/:id",
        name: "NoticeDetail",
        component: NoticeDetail,
        // meta: { maintenance: true },
    },

    // 관리자 페이지
    {
        path: "/admin/login",
        name: "AdminLoginView",
        component: AdminLoginView,
        meta: { hideHeaderFooter: true },
    },
    {
        path: "/admin/create",
        name: "AdminCreateView",
        component: AdminCreateView,
        meta: { hideFromGuard: true, hideHeaderFooter: true }, // 👉 관리자만 내부용으로 접근 가능하게
    },

    {
        path: "/admin",
        redirect: "/admin/dashboard",
        component: AdminLayout,
        meta: { hideHeaderFooter: true },
        children: [
            {
                path: "dashboard",
                name: "AdminDashboardView",
                component: AdminDashboardView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
            {
                path: "members",
                name: "AdminMemberManageView",
                component: AdminMemberManageView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
            {
                path: "withdraw",
                name: "AdminWithdrawnMemberManageView",
                component: AdminWithdrawnMemberManageView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
            {
                path: "orders",
                name: "AdminOrderManageView",
                component: AdminOrderManageView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
            {
                path: "delivery",
                name: "DeliveryStatusView",
                component: DeliveryStatusView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
            {
                path: "products",
                name: "ProductManageView",
                component: ProductManageView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
            {
                path: "kits",
                name: "KitManageView",
                component: KitManageView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
            {
                path: "answer",
                name: "AnswerManagerView",
                component: AnswerManagerView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
            {
                path: "notice",
                name: "NoticeManagerView",
                component: NoticeManagerView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
            {
                path: "shipping",
                name: "AdminShippingView",
                component: AdminShippingView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
            {
                path: "referral",
                name: "AdminReferralView",
                component: AdminReferralView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
            {
                path: "qna",
                name: "AdminQnaView",
                component: AdminQnaView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
        ],
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
        return next("/");
    }

    // 일반 사용자 인증
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem("token");
        if (!token || !store.getters.isAuthenticated) {
            alert("로그인이 필요한 페이지입니다.");
            return next("/login");
        }
    }

    // 관리자 전용 접근
    if (to.meta.requiresAdmin) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "admin") {
            alert("관리자만 접근할 수 있는 페이지입니다.");
            return next("/admin/login");
        }
    }

    next();
});

export default router;
