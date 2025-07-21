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

        <div class="footerBottom">
            <div class="footerCopyrightLeft">
                <p>© 2025 Karinabel. All Rights Reserved.</p>
            </div>
            <div class="footerInfoRight">
                <div class="footerLinks">
                    <ul>
                        <li>
                            <a href="/file/카리나벨 개인정보취급방침.pdf" target="_blank" class="clickable withDivider">
                                개인정보처리방침
                            </a>
                        </li>
                        <li>
                            <a href="/file/카리나벨 이용약관.pdf" target="_blank" class="clickable withDivider">
                                이용 약관
                            </a>
                        </li>

                        <!-- <li>
                            <a href="/mypage/members" class="clickable withDivider"> 회원 조회</a>
                        </li> -->
                        <li>
                            <a href="/mypage/withdraw" class="clickable">탈퇴신청</a>
                        </li>
                    </ul>
                </div>

                <ul class="footerCompanyInfo">
                    <li>카리나벨</li>
                    <li>대표사업자: 신은영</li>
                    <li>사업자등록번호: 443-19-01421</li>
                    <li>통신판매업신고: 2022-대전유성-0937</li>
                    <li>주소: 대전광역시 은구비남로7번길 73, 3층 301호</li>
                    <li>고객상담: 042-822-2581</li>
                    <li>FAX: 042-822-2582</li>
                    <li>이메일: karinabel@naver.com</li>
                </ul>
            </div>
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
    font-size: 14px;
    line-height: 1.6;
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
    background-color: #ccc;
}

.footerBottom {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    gap: 20px;
}

.footerCopyrightLeft {
    flex: 1;
    font-size: 13px;
    color: #ccc;
    display: flex;
    align-items: center;
}

.footerInfoRight {
    flex: 2;
    font-size: 13px;
    color: #ddd;
}

.footerLinks ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 12px;
    list-style: none;
    padding: 0;
    margin: 0 0 8px;
    font-size: 13px;
    color: #666;
}

.footerLinks ul li:not(:last-child) .withDivider::after {
    content: "|";
    margin-left: 12px;
    color: #999;
}

.footerCompanyInfo {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 12px;
    color: #aaa;
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
