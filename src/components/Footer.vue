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
                    <li>(주)카리나벨</li>
                    <li>대전광역시 은구비남로7번길 73, 3층 301호</li>
                    <li>고객상담: 000-0000</li>
                    <li>이메일 주소: memberId@karinabel.com</li>
                    <li>대표이사: 주재현 / 사업자등록번호: 443-19-01421</li>
                    <li>통신판매 등록번호: 0000-대전유성-0000</li>
                </ul>
            </div>
            <div class="footerSection basicInfo">
                <h3>카리나벨 베이직</h3>
                <ul>
                    <li @click="navigateTo('/notices')" class="clickable">공지사항</li>
                </ul>
            </div>
            <div class="footerSection essentialOils">
                <h3>최고의 품질 카리나벨 에센셜 오일</h3>
                <ul>
                    <li @click="navigateTo('/about/greeting')" class="clickable">인사말</li>
                    <li @click="navigateTo('/about/story')" class="clickable">브랜드 스토리</li>
                </ul>
            </div>
        </div>
        <div class="footerLinks">
            <ul>
                <li>
                    <a href="/file/카리나벨 개인정보취급방침.pdf" target="_blank" class="clickable">
                        개인정보처리방침
                    </a>
                </li>
                <!-- <li @click="navigateTo('/law')" class="clickable">관련법령</li> -->
                <li>
                    <a href="/file/카리나벨 이용약관.pdf" target="_blank" class="clickable"> 이용 약관 </a>
                </li>
                <!-- <li @click="navigateTo('/member')" class="clickable">회원조회</li> -->
            </ul>
        </div>
        <div class="footerCopyright">
            <p>© 2025 Karinabel</p>
        </div>
    </footer>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

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

function navigateTo(route) {
    router.push(route);
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
    transition: transform 0.2s, box-shadow 0.2s;
}
.socialIcon:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
.clickable {
    cursor: pointer;
    transition: color 0.2s, text-decoration 0.2s;
}
.clickable:hover {
    color: #cc8a94;
    text-decoration: underline;
}
</style>
