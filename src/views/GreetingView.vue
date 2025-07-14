<template>
    <div class="greetingContainer">
        <div class="introSection">
            <div class="executivePhotos">
                <div class="executiveWrapper">
                    <img
                        src="/img/executive2.jpg"
                        alt="대표사업자 신은영"
                        class="executivePhoto"
                    />
                    <p class="executiveName">대표사업자 신은영</p>
                </div>
            </div>
            <div class="greetingMessage">
                <h1 class="themaColor2">
                    향기로 완성하는 당신의 특별한 순간<br />
                    카리나벨이 함께 합니다.
                </h1>
                <p>
                    안녕하세요. 카리나벨을 찾아주신 소중한 고객님께 깊은 감사의
                    말씀을 전합니다.<br />
                    우리는 단순한 향을 넘어, 당신의 일상에 잊지 못할 감동과
                    특별한 가치를 선사하고자 최고 등급의 에센셜 오일을 엄선하여
                    수입하고 유통하는 전문 기업입니다.<br />
                    향기는 우리의 감정을 어루만지고, 기억을 깨우며, 때로는 삶의
                    방향을 바꾸는 놀라운 힘을 지니고 있습니다.<br />
                    카리나벨은 이러한 향기의 힘을 믿으며, 오랜 역사와 전통을
                    지닌 인도의 귀족 사회에서 사용되던 최상급 에센셜 오일을
                    비롯하여, 전 세계 각지에서 엄격한 기준으로 선별한 최고의
                    오일만을 선보입니다.<br />
                    우리는 고객 한 분 한 분의 취향과 필요를 세심하게 헤아려,
                    최상의 품질과 다양한 향의 경험을 제공하기 위해 끊임없이
                    노력하고 있습니다.<br />
                    카리나벨의 에센셜 오일이 당신의 공간을 아름다운 향기로 가득
                    채우고, 지친 하루에 위로와 활력을 더하며, 소중한 사람들과의
                    순간을 더욱 특별하게 만들어 줄 것이라고 믿습니다.<br />
                    카리나벨과 함께, 향기로 더욱 풍요로워지는 삶을 경험해
                    보세요.<br />
                    당신의 모든 순간이 향기로 기억되는 특별한 하루가 되기를
                    진심으로 기원합니다.
                </p>
                <h2 class="themaColor3">대표사업자 신은영 올림</h2>
            </div>
        </div>
    </div>
</template>

<script setup></script>

<style scoped>
.greetingContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
    background-color: #fefcfc;
}
.introSection {
    max-width: 1000px;
    text-align: center;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 30px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}
.executivePhotos {
    display: flex;
    justify-content: center;
    gap: 80px;
    margin-bottom: 50px;
}
.executiveWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.executivePhoto {
    width: 260px;
    height: 260px;
    border-radius: 50%;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    object-fit: cover;
}
.executiveName {
    margin-top: 18px;
    font-size: 1.3rem;
    color: #604b6e;
    font-weight: bold;
}
.greetingMessage h1 {
    font-size: 2.5rem;
    margin-bottom: 24px;
    color: #cc8a94;
    font-weight: 700;
}
.greetingMessage p {
    font-size: 1.05rem;
    line-height: 1.9;
    color: #555;
    margin-bottom: 50px;
    padding: 0 10px;
}
.greetingMessage h2 {
    font-size: 1.6rem;
    font-weight: bold;
    color: #857496;
}

@media (max-width: 1200px) {
    .greetingMessage h1 {
        font-size: 1.8rem;
    }

    .greetingMessage p {
        font-size: 0.92rem;
    }

    .greetingMessage h2 {
        font-size: 1.4rem;
    }
}

@media (max-width: 600px) {
    .greetingContainer {
        padding: 40px 10px;
    }

    .greetingMessage h1 {
        font-size: 1.6rem;
    }

    .greetingMessage p {
        font-size: 0.9rem;
    }

    .greetingMessage h2 {
        font-size: 1.2rem;
    }
    .introSection {
        padding: 20px;
    }
}
</style>
