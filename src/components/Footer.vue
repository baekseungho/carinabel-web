<template>
    <footer class="footerContainer">
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
                <h3>도테라 베이직</h3>
                <ul>
                    <li>다이아몬드 클럽</li>
                    <li>실버 클럽</li>
                    <li>공지사항</li>
                </ul>
            </div>
            <div class="footerSection essentialOils">
                <h3>세계1등 카리나라벨 에센셜 오일</h3>
                <ul>
                    <li>에센셜 오일이란?</li>
                    <li>왜 카리나라벨인가?</li>
                    <li>에센셜 오일은 어떻게 사용할까?</li>

                    <li>글로벌 보테니컬 네트워크</li>
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
// Footer component logic (if needed)
</script>

<style scoped>
.footerContainer {
    background-color: #f7f9fc;
    padding: 40px 20px;
    color: #333;
}
.footerWrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
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
    gap: 16px;
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 12px;
    color: #666;
}
.footerCopyright {
    text-align: center;
    font-size: 12px;
    color: #999;
}
</style>
