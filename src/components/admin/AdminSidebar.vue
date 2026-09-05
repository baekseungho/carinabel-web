<template>
    <aside :class="['admin-sidebar',{open}]" aria-label="관리자 메뉴">
        <div class="sidebar-head">
            <RouterLink to="/admin/dashboard" class="admin-brand" @click="$emit('navigate')"><img src="/img/logo2.png" alt="카리나벨" /><span>ADMIN</span></RouterLink>
            <button type="button" class="sidebar-close" aria-label="관리자 메뉴 닫기" @click="$emit('navigate')"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <nav><section v-for="group in menuGroups" :key="group.label" class="menu-group"><p>{{group.label}}</p><RouterLink v-for="item in group.items" :key="item.to" :to="item.to" @click="$emit('navigate')"><i :class="item.icon"></i><span>{{item.label}}</span><i class="fa-solid fa-chevron-right arrow"></i></RouterLink></section></nav>
        <div class="sidebar-foot"><span><i class="fa-solid fa-shield-halved"></i></span><p><strong>관리자 전용</strong><small>권한이 있는 사용자만 이용해 주세요.</small></p></div>
    </aside>
</template>
<script setup>
defineProps({open:Boolean});defineEmits(["navigate"]);
const menuGroups=[
 {label:"OVERVIEW",items:[{label:"대시보드",to:"/admin/dashboard",icon:"fa-solid fa-chart-pie"}]},
 {label:"MEMBERS",items:[{label:"회원 관리",to:"/admin/members",icon:"fa-regular fa-user"},{label:"탈퇴회원 관리",to:"/admin/withdraw",icon:"fa-solid fa-user-slash"},{label:"수당 관리",to:"/admin/referral",icon:"fa-solid fa-coins"}]},
 {label:"ORDERS",items:[{label:"주문 관리",to:"/admin/orders",icon:"fa-solid fa-receipt"},{label:"배송 현황",to:"/admin/shipping",icon:"fa-solid fa-truck"},{label:"주문 취소",to:"/admin/cancle",icon:"fa-solid fa-rotate-left"},{label:"수기 입력",to:"/admin/menual",icon:"fa-solid fa-pen-to-square"}]},
 {label:"CATALOG",items:[{label:"상품 관리",to:"/admin/products",icon:"fa-solid fa-bottle-droplet"},{label:"키트 관리",to:"/admin/kits",icon:"fa-solid fa-box-open"}]},
 {label:"CONTENT",items:[{label:"공지사항",to:"/admin/notice",icon:"fa-regular fa-clipboard"},{label:"Q&A 답변",to:"/admin/answer",icon:"fa-regular fa-comments"}]},
];
</script>
<style scoped>
.admin-sidebar{position:fixed;inset:0 auto 0 0;z-index:1200;width:260px;display:flex;flex-direction:column;color:#d8cfd3;background:#2c2529;border-right:1px solid #43393e}.sidebar-head{height:82px;display:flex;align-items:center;justify-content:space-between;padding:0 23px;border-bottom:1px solid #43393e}.admin-brand{display:flex;align-items:center;gap:9px}.admin-brand img{width:122px;height:48px;object-fit:contain;filter:grayscale(1) brightness(4)}.admin-brand span{padding:2px 5px;border:1px solid #695a61;color:#bcaeb4;font-size:.48rem;font-weight:800;letter-spacing:.12em}.sidebar-close{display:none;width:36px;height:36px;border:0;color:#ddd;background:transparent}.admin-sidebar nav{flex:1;padding:19px 14px;overflow-y:auto}.menu-group{margin-bottom:18px}.menu-group>p{padding:0 12px 7px;color:#796d72;font-size:.52rem;font-weight:800;letter-spacing:.16em}.menu-group a{display:grid;grid-template-columns:25px 1fr 10px;align-items:center;min-height:42px;padding:0 12px;border-radius:3px;color:#bfb4b9;font-size:.72rem}.menu-group a>i:first-child{color:#8e7e85;font-size:.76rem}.menu-group .arrow{opacity:0;color:#d9aab2;font-size:.5rem}.menu-group a:hover{color:#fff;background:#372f33}.menu-group a.router-link-active{color:#fff;background:#4a3a42;font-weight:700}.menu-group a.router-link-active>i:first-child{color:#d7a5ae}.menu-group a.router-link-active .arrow{opacity:1}.sidebar-foot{display:flex;gap:10px;margin:14px;padding:15px;border-top:1px solid #4a3f44;background:#332b2f}.sidebar-foot>span{color:#d2a2ab}.sidebar-foot strong,.sidebar-foot small{display:block}.sidebar-foot strong{color:#e4dce0;font-size:.65rem}.sidebar-foot small{margin-top:2px;color:#887b81;font-size:.53rem;line-height:1.45}
@media(max-width:900px){.admin-sidebar{width:min(290px,86vw);transform:translateX(-105%);box-shadow:18px 0 45px rgba(22,15,19,.25);transition:transform .25s ease}.admin-sidebar.open{transform:none}.sidebar-close{display:grid;place-items:center}}
</style>
