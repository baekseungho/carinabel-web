<template>
    <header ref="headerRoot" class="site-header" @keydown.esc="closeAll">
        <div class="header-inner">
            <RouterLink to="/" class="brand" aria-label="카리나벨 홈" @click="closeAll"><img src="/img/logo2.png" alt="카리나벨" /></RouterLink>
            <nav class="desktop-nav" aria-label="주 메뉴">
                <div v-for="item in menuItems" :key="item.label" class="nav-group" :class="{ open: activeDesktopMenu === item.label }">
                    <RouterLink v-if="item.to" :to="item.to" class="nav-link">{{ item.label }}</RouterLink>
                    <button v-else class="nav-link nav-button" type="button" :aria-expanded="activeDesktopMenu === item.label" :aria-controls="`desktop-menu-${item.label}`" @click="toggleDesktopMenu(item.label)">{{ item.label }} <i class="fa-solid fa-chevron-down"></i></button>
                    <div v-if="item.children" :id="`desktop-menu-${item.label}`" class="dropdown">
                        <RouterLink v-for="child in item.children" :key="child.to" :to="child.to" @click="closeAll">{{ child.label }}</RouterLink>
                    </div>
                </div>
            </nav>
            <div class="header-actions">
                <button class="icon-action mobile-toggle" type="button" :aria-expanded="isMobileMenuOpen" aria-controls="mobile-navigation" :aria-label="isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'" @click="toggleMobileMenu"><i :class="isMobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i></button>
                <RouterLink to="/cart" class="icon-action" aria-label="장바구니"><i class="fa-solid fa-bag-shopping"></i><span>장바구니</span></RouterLink>
                <button class="icon-action" type="button" :aria-expanded="showAuthMenu" aria-controls="account-menu" @click="toggleAuthMenu"><i class="fa-regular fa-user"></i><span>{{ isAuthenticated ? userName + '님' : '로그인' }}</span></button>
                <div v-if="showAuthMenu" id="account-menu" class="account-popover">
                    <p class="account-kicker">MY KARINABEL</p>
                    <strong>{{ isAuthenticated ? userName + '님, 반가워요.' : '향기로운 일상을 시작해보세요.' }}</strong>
                    <small v-if="isAuthenticated">회원등급 {{ userMembershipLevel }}</small>
                    <template v-if="!isAuthenticated"><button class="primary-btn" @click="move('/login')">로그인</button><button class="text-btn" @click="move('/signup')">아직 회원이 아니신가요? <b>회원가입</b></button></template>
                    <template v-else><button class="primary-btn" @click="move('/mypage')">마이페이지</button><button class="text-btn" @click="handleLogout">로그아웃</button></template>
                </div>
            </div>
        </div>
        <transition name="menu-fade">
            <nav v-if="isMobileMenuOpen" id="mobile-navigation" class="mobile-nav" aria-label="모바일 주 메뉴">
                <div v-for="item in menuItems" :key="item.label" class="mobile-group">
                    <RouterLink v-if="item.to" :to="item.to" @click="closeAll">{{ item.label }}</RouterLink><p v-else>{{ item.label }}</p>
                    <RouterLink v-for="child in item.children" :key="child.to" :to="child.to" @click="closeAll">{{ child.label }}</RouterLink>
                </div>
            </nav>
        </transition>
    </header>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
const store = useStore(); const router = useRouter(); const route = useRoute();
const headerRoot = ref(null);
const showAuthMenu = ref(false); const isMobileMenuOpen = ref(false);
const activeDesktopMenu = ref("");
const isAuthenticated = computed(() => store.getters.isAuthenticated);
const userName = computed(() => store.getters.userName);
const userMembershipLevel = computed(() => store.getters.membershipLevel);
const menuItems = [
    { label: "SHOP", children: [{ label: "에센셜 오일", to: "/products/onlymember" }, { label: "키트 상품", to: "/products/kits" }] },
    { label: "ABOUT", children: [{ label: "인사말", to: "/about/greeting" }, { label: "브랜드 스토리", to: "/about/story" }, { label: "찾아오시는 길", to: "/about/navigate" }] },
    { label: "BUSINESS", children: [{ label: "행사 · 이벤트", to: "/business/events" }, { label: "강의자료", to: "/business/lectures" }] },
    { label: "NOTICE", to: "/notices" }, { label: "Q&A", to: "/qna" },
];
const closeAll = () => { isMobileMenuOpen.value = false; showAuthMenu.value = false; activeDesktopMenu.value = ""; };
const toggleDesktopMenu = (label) => { activeDesktopMenu.value = activeDesktopMenu.value === label ? "" : label; showAuthMenu.value = false; };
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value; showAuthMenu.value = false; };
const toggleAuthMenu = () => { showAuthMenu.value = !showAuthMenu.value; isMobileMenuOpen.value = false; activeDesktopMenu.value = ""; };
const move = (path) => { closeAll(); router.push(path); };
const handleLogout = () => { store.dispatch("logout"); closeAll(); router.push("/"); };
const handleOutsideClick = (event) => { if (headerRoot.value && !headerRoot.value.contains(event.target)) closeAll(); };
onMounted(() => document.addEventListener("pointerdown", handleOutsideClick));
watch(() => route.fullPath, closeAll);
watch(isMobileMenuOpen, (open) => { document.body.style.overflow = open ? "hidden" : ""; });
onBeforeUnmount(() => { document.body.style.overflow = ""; document.removeEventListener("pointerdown", handleOutsideClick); });
</script>

<style scoped>
.site-header{position:sticky;top:0;z-index:1000;height:84px;background:rgba(255,255,255,.92);border-bottom:1px solid rgba(134,101,119,.12);backdrop-filter:blur(18px)}.header-inner{width:min(calc(100% - 48px),1380px);height:100%;margin:auto;display:grid;grid-template-columns:210px 1fr 210px;align-items:center}.brand{width:164px}.brand img{width:100%;height:56px;object-fit:contain}.desktop-nav{display:flex;justify-content:center;gap:10px;height:100%}.nav-group{position:relative;display:flex;align-items:center}.nav-link{padding:28px 17px;border:0;background:transparent;color:#3a3337;font-size:.8rem;font-weight:700;letter-spacing:.1em;cursor:pointer}.nav-link i{margin-left:5px;font-size:.58rem;color:#a69ba1}.nav-link:after{content:"";display:block;width:0;height:1px;margin-top:4px;background:var(--color-accent);transition:width .25s}.nav-group:hover .nav-link:after,.nav-link.router-link-active:after{width:100%}.dropdown{position:absolute;top:76px;left:50%;min-width:180px;padding:10px;background:#fff;border:1px solid var(--color-line);border-radius:14px;box-shadow:var(--shadow-soft);opacity:0;visibility:hidden;transform:translate(-50%,8px);transition:.2s}.nav-group:hover .dropdown{opacity:1;visibility:visible;transform:translate(-50%,0)}.dropdown a{display:block;padding:10px 13px;border-radius:9px;color:var(--color-muted);font-size:.88rem;white-space:nowrap}.dropdown a:hover{color:var(--color-brand-dark);background:var(--color-warm)}.header-actions{position:relative;display:flex;justify-content:flex-end;gap:8px}.icon-action{min-width:64px;height:54px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:0;background:transparent;color:#4a4246;cursor:pointer}.icon-action i{font-size:1.05rem}.icon-action span{font-size:.68rem}.icon-action:hover{color:var(--color-accent)}.mobile-toggle{display:none;min-width:40px}.account-popover{position:absolute;top:66px;right:0;width:300px;padding:26px;border:1px solid var(--color-line);border-radius:18px;background:#fff;box-shadow:var(--shadow-soft)}.account-popover strong,.account-popover small{display:block}.account-popover strong{margin:4px 0 8px;font-size:1rem}.account-popover small{margin-bottom:18px;color:var(--color-muted)}.account-kicker{color:var(--color-accent);font-size:.66rem;font-weight:800;letter-spacing:.16em}.primary-btn{width:100%;padding:12px;margin-top:14px;border:0;border-radius:999px;color:#fff;background:var(--color-brand);font-weight:700;cursor:pointer}.text-btn{width:100%;margin-top:13px;border:0;color:var(--color-muted);background:transparent;font-size:.78rem;cursor:pointer}.mobile-nav{position:absolute;top:84px;left:0;width:100%;max-height:calc(100vh - 84px);padding:20px 24px 28px;overflow-y:auto;background:#fff;border-bottom:1px solid var(--color-line);box-shadow:var(--shadow-soft)}.mobile-group{padding:12px 0;border-bottom:1px solid var(--color-line)}.mobile-group p,.mobile-group>a:first-child{display:block;padding:5px 0;font-size:.78rem;font-weight:800;letter-spacing:.12em}.mobile-group p~a{display:inline-block;margin:8px 22px 2px 0;color:var(--color-muted);font-size:.88rem}.menu-fade-enter-active,.menu-fade-leave-active{transition:.2s}.menu-fade-enter-from,.menu-fade-leave-to{opacity:0;transform:translateY(-8px)}
@media(max-width:1050px){.header-inner{grid-template-columns:1fr auto}.desktop-nav{display:none}.mobile-toggle{display:flex}.brand{width:150px}}@media(max-width:560px){.site-header{height:72px}.header-inner{width:calc(100% - 24px)}.brand{width:125px}.brand img{height:46px}.icon-action span{display:none}.icon-action{min-width:38px;height:44px}.mobile-nav{top:72px}.account-popover{top:56px;right:0;width:min(300px,calc(100vw - 24px))}}
</style>
<style scoped>
.nav-group:focus-within .dropdown,.nav-group.open .dropdown{opacity:1;visibility:visible;transform:translate(-50%,0)}
</style>
