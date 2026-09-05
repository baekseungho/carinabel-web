import { createRouter, createWebHistory } from "vue-router";
const view = (name) => () => import(`../views/${name}.vue`);
const myPageView = (name) => () => import(`../views/myPage/${name}.vue`);
const adminView = (name) => () => import(`../adminViews/${name}.vue`);

const HomeView = view("HomeView");
const Login = view("LoginView"); const Signup = view("SignupView"); const Cart = view("CartView");
const MyPageView = view("MyPageView"); const InfoView = myPageView("InfoView");
const MemberManageView = myPageView("MemberManageView"); const EarningStatsView = myPageView("EarningStats");
const OrderManageView = myPageView("OrderManageView"); const InquiriesView = myPageView("InquiriesView");
const AddressView = myPageView("AddressView"); const OrderHistoryView = myPageView("OrderHistoryView");
const OrderHistoryDetailView = myPageView("OrderHistoryDetailView"); const WithdrawView = myPageView("WithdrawView");
const ProductView = view("ProductView"); const ProductDetail = view("ProductDetail");
const Onlymember = view("OnlyMemberView"); const OnlymemberDetail = view("OnlyMemberDetailView");
const OrderComplete = view("OrderCompleteView"); const Kit = view("KitView"); const KitDetail = view("KitDetailView");
const AboutView = view("AboutView"); const Greeting = view("GreetingView");
const Story = view("StoryView"); const Navigate = view("NavigateView"); const Events = view("EventsView");
const Lectures = view("LecturesView"); const QnA = view("QnAView"); const QnACreate = view("QnACreateView");
const QnADetail = view("QnADetailView"); const Notices = view("NoticesView"); const NoticeDetail = view("NoticeDetailView");
const ServicePreparing = view("ServicePreparingView"); const NotFound = view("NotFoundView");
const AdminLayout = adminView("AdminLayout"); const AdminLoginView = adminView("AdminLoginView");
const AdminCreateView = adminView("AdminCreateView"); const AdminDashboardView = adminView("AdminDashboardView");
const AdminMemberManageView = adminView("AdminMemberManageView");
const AdminWithdrawnMemberManageView = adminView("AdminWithdrawnMemberManageView");
const AdminOrderManageView = adminView("AdminOrderManageView");
const ProductManageView = adminView("ProductManagerView"); const KitManageView = adminView("AdminKitManageView");
const AnswerManagerView = adminView("AnswerManagerView"); const AdminShippingView = adminView("AdminShippingView");
const NoticeManagerView = adminView("AdminNoticeView");
const AdminOrderCancleView = adminView("AdminOrderCancleView"); const AdminManualInputView = adminView("AdminManualInputView");
const AdminReferralView = adminView("AdminReferralEarningsView");

import store from "@/store";
import { getStoredToken, getStoredUser } from "@/utils/storage";

const routes = [
    { path: "/", name: "Home", component: HomeView },

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
    { path: "/cart", name: "Cart", component: Cart, meta: { requiresAuth: true } },
    {
        path: "/mypage",
        component: MyPageView, // 여기에 SideMenu 항상 존재
        meta: { requiresAuth: true },
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
    { path: "/service-preparing", name: "ServicePreparing", component: ServicePreparing },
    {
        path: "/qna",
        name: "QnA",
        component: QnA,
    },
    { path: "/qna/create", name: "QnACreate", component: QnACreate, meta: { requiresAuth: true } },
    { path: "/qna/:id", name: "QnADetail", component: QnADetail, meta: { requiresAuth: true } },
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
        meta: { requiresAdmin: true, hideHeaderFooter: true },
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
                redirect: "/admin/shipping",
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
                redirect: "/admin/answer",
            },
            {
                path: "cancle",
                name: "AdminOrderCancleView",
                component: AdminOrderCancleView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
            {
                path: "menual",
                name: "AdminManualOrderView",
                component: AdminManualInputView,
                meta: { requiresAdmin: true, hideHeaderFooter: true },
            },
        ],
    },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition;
        if (to.hash) return { el: to.hash, behavior: "smooth" };
        return { top: 0 };
    },
});

// ❗ 전역 네비게이션 가드

router.beforeEach((to, from, next) => {
    if (to.meta.maintenance) {
        return next({ name: "ServicePreparing", query: { from: to.fullPath } });
    }

    // 일반 사용자 인증
    if (to.meta.requiresAuth) {
        const token = getStoredToken();
        if (!token || !store.getters.isAuthenticated) {
            return next({ name: "Login", query: { redirect: to.fullPath, reason: "auth" } });
        }
    }

    // 관리자 전용 접근
    if (to.meta.requiresAdmin) {
        const user = store.state.user || getStoredUser();
        const token = getStoredToken();
        if (!token || !user || user.role !== "admin") {
            alert("관리자만 접근할 수 있는 페이지입니다.");
            return next("/admin/login");
        }
    }

    next();
});

export default router;

const pageTitles = {
    Home: "카리나벨 | 자연의 생명력을 담은 에센셜 오일",
    Products: "에센셜 오일",
    ProductDetail: "상품 상세",
    Onlymember: "에센셜 오일",
    OnlymemberDetail: "상품 상세",
    Kit: "키트 컬렉션",
    KitDetail: "키트 상세",
    Cart: "장바구니",
    Login: "로그인",
    Signup: "회원가입",
    MyPageMain: "마이페이지",
    Greeting: "인사말",
    Story: "브랜드 스토리",
    Navigate: "찾아오시는 길",
    Notices: "공지사항",
    NoticeDetail: "공지사항 상세",
    QnA: "Q&A",
    QnACreate: "문의 작성",
    QnADetail: "문의 상세",
    AdminLoginView: "관리자 로그인",
    AdminCreateView: "관리자 계정 생성",
    AdminDashboardView: "관리자 대시보드",
    AdminMemberManageView: "회원 관리",
    AdminWithdrawnMemberManageView: "탈퇴 회원 관리",
    AdminOrderManageView: "주문 관리",
    AdminShippingView: "배송 관리",
    AdminOrderCancleView: "주문 취소 관리",
    AdminManualOrderView: "수기 등록",
    ProductManageView: "상품 관리",
    KitManageView: "키트 관리",
    AdminReferralView: "추천 수당 관리",
    NoticeManagerView: "공지사항 관리",
    AnswerManagerView: "Q&A 답변 관리",
    ServicePreparing: "서비스 준비 중",
    NotFound: "페이지를 찾을 수 없습니다",
};

router.afterEach((to) => {
    const title = pageTitles[to.name] || "카리나벨";
    document.title = title.includes("카리나벨") ? title : `${title} | 카리나벨`;
});
