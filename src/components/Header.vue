<template>
  <header class="headerContainer">
    <div class="logoContainer">
      <img src="/img/logo.jpg" alt="Logo" class="logo" @click="goHome" />
    </div>
    <nav class="navContainer">
      <ul class="navList">
        <li class="menuItem">
          <a href="#">제품</a>
          <ul class="subMenu">
            <li><a href="/products">에센션 오일</a></li>
            <li><a href="/products">제품종류2</a></li>
            <li><a href="/products">제품종류3</a></li>
          </ul>
        </li>
        <li class="menuItem">
          <a href="#">회사소개</a>
          <ul class="subMenu">
            <li><a href="/about/greeting">인사말</a></li>
            <li><a href="/about/executives">경영진</a></li>
            <li><a href="/about/brand-story">브랜드 스토리</a></li>
          </ul>
        </li>
        <li class="menuItem">
          <a href="#">비즈니스</a>
          <ul class="subMenu">
            <li><a href="/business/events">행사/이벤트</a></li>
            <li><a href="/business/lectures">강의자료</a></li>
          </ul>
        </li>
        <li class="menuItem"><a href="/notices">공지사항</a></li>
        <li class="menuItem"><a href="/qna">QnA</a></li>
      </ul>
    </nav>
    <div class="authContainer">
      <button class="authButton">로그인</button>
    </div>
  </header>
</template>

<script setup>
import router from "@/router";

const goHome = () => {
  router.push({ path: "/" });
};
</script>

<style scoped>
.headerContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1000;
}

.logoContainer .logo {
  height: 40px;
  cursor: pointer;
}

.navContainer .navList {
  display: flex;
  gap: 2rem;
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
  color: #8a2be2;
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
  color: #8a2be2;
  border-left: 3px solid #8a2be2;
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
