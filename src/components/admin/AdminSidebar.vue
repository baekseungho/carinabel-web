<template>
    <aside class="adminSidebar">
        <nav class="menu">
            <ul>
                <li>
                    <router-link to="/admin/dashboard" active-class="active"
                        >대시보드</router-link
                    >
                </li>
                <li>
                    <router-link to="/admin/members" active-class="active"
                        >회원 리스트</router-link
                    >
                </li>
                <li>
                    <router-link to="/admin/orders" active-class="active"
                        >주문 리스트</router-link
                    >
                </li>
                <li>
                    <router-link to="/admin/shipping" active-class="active"
                        >배송 현황</router-link
                    >
                </li>
                <li>
                    <router-link to="/admin/products" active-class="active"
                        >상품 등록</router-link
                    >
                </li>
                <li>
                    <router-link to="/admin/kits" active-class="active"
                        >키트 관리</router-link
                    >
                </li>
                <li>
                    <router-link to="/admin/answer" active-class="active"
                        >QnA</router-link
                    >
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup>
// 별도 script 없음
</script>

<style scoped>
.adminSidebar {
    width: 200px;
    height: 100vh;
    background-color: #f5f5f5;
    border-right: 1px solid #ddd;
    padding: 2rem 1rem;
    position: fixed;
    top: 0;
    left: 0;
    overflow-y: auto;
}

.menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.menu li {
    margin-bottom: 1rem;
}

.menu a {
    text-decoration: none;
    color: #333;
    font-weight: 600;
    padding: 0.5rem 1rem;
    display: block;
    border-radius: 6px;
    transition: background-color 0.3s ease;
}

.menu a:hover,
.menu a.active {
    background-color: #cc8a94;
    color: #fff;
}
</style>
