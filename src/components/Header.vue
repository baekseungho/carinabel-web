<template>
    <header class="header-container">
        <div class="logoContainer">
            <img src="/img/logo2.png" alt="Logo" class="logo" />
        </div>
        <nav class="navContainer">
            <ul class="navList">
                <li><a href="#">제품</a></li>
                <li><a href="#">회사소개</a></li>
                <li><a href="#">비즈니스</a></li>
                <li><a href="#">공지사항</a></li>
                <li><a href="#">QnA</a></li>
            </ul>
        </nav>
        <div class="authContainer">
            <button class="authButton">로그인</button>
        </div>
    </header>
</template>

<script setup>
// 추후 로직 추가 예정
</script>

<style scoped>
.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background-color: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.logoContainer .logo {
    height: 40px;
    cursor: pointer;
}

.navContainer .navList {
    display: flex;
    gap: 2rem;
}

.navContainer .navList li {
    list-style: none;
}

.navContainer .navList li a {
    font-weight: 600;
    color: #333;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
}

.navContainer .navList li a:hover {
    color: #8a2be2;
}

.authContainer .authButton {
    padding: 0.5rem 1.5rem;
    background-color: #8a2be2;
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s ease-in-out;
}

.authContainer .authButton:hover {
    background-color: #6a1bb3;
}
</style>
