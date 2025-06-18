<template>
    <div class="storyContainer">
        <div class="storyContent">
            <div class="storyImageWrapper">
                <img
                    src="/img/A_photograph_captures_a_young_woman_with_fair_skin.png"
                    alt="생명력을 담은 향기"
                    class="storyImage"
                />
            </div>
            <h1 class="storyTitle themaColor2">
                카리나벨, 생명력(아벨)을 담은 <br />
                소중하고 사랑스러운(카리나) 향기
            </h1>
            <p class="storyText">
                카리나벨은 라틴어 '카리나(소중하고 사랑스러운)'와
                '아벨(생명력)'의 아름다운 조화에서 탄생했습니다. 그 이름처럼,
                우리는 소중한 당신에게 생명력 넘치는 향기를 전하고자 합니다.<br /><br />
                우리의 여정은 5000년의 역사를 품은 신비로운 땅, 인도로 향하는
                깊은 탐구에서 시작되었습니다. 고대 실크로드를 따라 향을 찾아
                모여들었던 수많은 상인들의 발길이 닿았던 곳, 전 세계 에센셜
                오일의 원산지라 불리는 '젖과 꿀이 흐르는 땅' 인도에서 우리는
                최고의 에센셜 오일이 존재할 것이라는 확신을 얻었습니다.<br /><br />
                오랜 시간 인도를 탐험하며, 우리는 그곳에서 가장 순수한 에센셜
                오일, 인도 귀족 사회에서 사용되던 최상급 등급의 특별한 오일을
                발견했습니다. 그 순간, 이 귀한 선물을 더 많은 사람들에게 전하고
                싶다는 간절한 소망이 우리 마음속에 피어났습니다.<br /><br />
                이제, 카리나벨은 한국을 통해 국제적인 기준을 충족하는 최상의
                에센셜 오일을 선보입니다. 지금껏 경험하지 못했던 향의 순수함과
                깊이를 느껴보십시오. 자연의 생명력이 가득 담긴 향기가 당신의
                감각을 깨우고, 일상에 새로운 활력을 불어넣을 것입니다.<br /><br />
                카리나벨은 '자연을 닮은 사람'이 되고자 합니다. 스스로 회복하고,
                맑고 선한 영향력으로 세상을 이롭게 하는 자연처럼, 카리나벨의
                향기가 당신에게 소중하고 사랑스러운 생명력을 전하는 아름다운
                통로가 되기를 소망합니다. 우리는 이 철학을 가슴에 새기며
                '자.닮.인', 즉 '자연을 닮은 사람'의 마음으로 당신에게
                다가갑니다.
            </p>
        </div>
    </div>
</template>

<script setup></script>

<style scoped>
.storyContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
    background-color: #fefcfc;
}
.storyContent {
    max-width: 1000px;
    text-align: center;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 30px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}
.storyImageWrapper {
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
}
.storyImage {
    width: 100%;
    max-width: 640px;
    border-radius: 30px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    object-fit: cover;
}
.storyTitle {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 28px;
    color: #cc8a94;
}
.storyText {
    font-size: 1.05rem;
    line-height: 1.9;
    color: #555;
    margin-bottom: 40px;
    padding: 0 10px;
}

@media (max-width: 1200px) {
    .storyTitle {
        font-size: 1.8rem;
    }

    .storyText {
        font-size: 0.92rem;
    }

    .greetingMessage h2 {
        font-size: 1.4rem;
    }
}

@media (max-width: 600px) {
    .storyContainer {
        padding: 40px 10px;
    }

    .storyContent h1 {
        font-size: 1.6rem;
    }

    .storyContent p {
        font-size: 0.9rem;
    }
    .storyContent {
        padding: 20px;
    }
}
</style>
