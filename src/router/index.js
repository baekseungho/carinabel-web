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
import ProductView from "@/views/ProductView.vue";
import ProductDetail from "@/views/ProductDetail.vue";
import Onlymember from "@/views/OnlyMemberView.vue";
import OnlymemberDetail from "@/views/OnlyMemberDetailView.vue";
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

import ProductManageView from "@/adminViews/ProductManagerView.vue";
import AnswerManagerView from "@/adminViews/AnswerManagerView.vue";

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
  {
    path: "/products/onlymember/:id",
    name: "OnlymemberDetail",
    component: OnlymemberDetail,
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
      { path: "inquiries", name: "InquiriesView", component: InquiriesView },
      // ...
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
    path: "/admin/products",
    name: "ProductManageView",
    component: ProductManageView,
  },
  {
    path: "/admin/answer",
    name: "AnswerManagerView",
    component: AnswerManagerView,
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
