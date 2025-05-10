<template>
  <footer class="footerContainer">
    <div class="footerIcons">
      <img
        v-for="icon in socialIcons"
        :key="icon.name"
        :src="icon.imagePath"
        :alt="icon.name"
        @click="goToLink(icon.link)"
        class="socialIcon"
      />
    </div>
    <div class="fotterLine themaBgColor4"></div>
    <div class="footerWrapper">
      <div class="footerSection customerCenter">
        <h3>고객센터</h3>
        <ul>
          <li>카리나라벨 코리아</li>
          <li>대전광역시 유성구 남부순환로 2561, 지하 1층~지상 2층</li>
          <li>고객상담: 000-0000</li>
          <li>이메일 주소: email@karinabel.com</li>
          <li>대표이사: 주재현 / 사업자등록번호: 000-00-00000</li>
          <li>통신판매 등록번호: 0000-서울서초-0000</li>
        </ul>
      </div>
      <div class="footerSection basicInfo">
        <h3>카리나나벨 베이직</h3>
        <ul>
          <li>공지사항</li>
        </ul>
      </div>
      <div class="footerSection essentialOils">
        <h3>최고의 품질 카리나라벨 에센셜 오일</h3>
        <ul>
          <li>인사말</li>
          <li>브랜드 스토리</li>
        </ul>
      </div>
    </div>
    <div class="footerLinks">
      <ul>
        <li>개인정보처리방침</li>
        <li>관련법령</li>
        <li>평균수당 공지</li>
        <li>이용 약관</li>
        <li>회원조회</li>
      </ul>
    </div>
    <div class="footerCopyright">
      <p>© 2025 Karinabel</p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";

const socialIcons = ref([
  {
    name: "Instagram",
    link: "https://www.instagram.com/",
    imagePath: "/img/logo_instagram.svg",
  },
  {
    name: "YouTube",
    link: "https://www.youtube.com/",
    imagePath: "/img/logo_youtube.png",
  },
  {
    name: "Blog",
    link: "https://blog.naver.com/",
    imagePath: "/img/logo_naverblog.png",
  },
  {
    name: "Kakao",
    link: "https://www.kakao.com/",
    imagePath: "/img/logo_kakao.svg",
  },
  {
    name: "Facebook",
    link: "https://www.facebook.com/",
    imagePath: "/img/logo_facebook.png",
  },
]);

function goToLink(link) {
  window.open(link, "_blank");
}
</script>

<style scoped>
.footerContainer {
  background-color: #f7f9fc;
  padding: 40px 20px;
  color: #333;
}
.footerIcons {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}
.socialIcon {
  width: 44px;
  height: 44px;
  cursor: pointer;
  border-radius: 50%;
  /* border: 1xp solid #cc8a94; */
}
.fotterLine {
  height: 1px;
  width: 100%;
  opacity: 0.6;
  margin: 16px 0;
}
.footerWrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 24px;
}
.footerSection h3 {
  font-size: 18px;
  margin-bottom: 16px;
}
.footerSection ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footerSection li {
  margin-bottom: 8px;
  font-size: 14px;
}
.footerLinks ul {
  display: flex;
  justify-content: center;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;
}
.footerCopyright {
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
