<template>
    <div class="withdrawContainer">
        <div class="withdrawCard">
            <h2>정말 탈퇴하시겠어요?</h2>
            <p class="description">
                카리나벨에서 제공하는 <strong>할인 혜택</strong>, <strong>추천 수당</strong>,
                <strong>회원 전용 서비스</strong>를 모두 잃게 됩니다.
            </p>

            <div class="suggestions">
                <p>💡 이런 건 어떠세요?</p>
                <ul>
                    <li>- 구매 혜택 다시 확인하기</li>
                    <li>- 추천인 혜택 더 알아보기</li>
                    <li>- 고객센터 문의하기</li>
                </ul>
            </div>

            <textarea v-model="reason" placeholder="탈퇴 사유를 입력해주세요 (선택)" class="reasonInput"></textarea>

            <div class="buttonGroup">
                <button class="stayBtn" @click="goBack">조금 더 사용해볼게요</button>
                <button class="withdrawBtn" @click="handleWithdraw">탈퇴할래요</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserService from "@/api/UserService";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const reason = ref("");

const handleWithdraw = () => {
    const token = store.state.token;
    if (!token) {
        alert("로그인이 필요합니다.");
        return;
    }

    if (!confirm("정말 탈퇴하시겠습니까?")) return;

    UserService.withdrawAccount(token, reason.value)
        .then(() => {
            alert("탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.");

            // ✅ 로그아웃 처리 (store 비우기 + localStorage 비우기)
            store.dispatch("logout");

            // ✅ 홈으로 이동
            router.push("/");
        })
        .catch((error) => {
            console.error(error);
            alert("탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
        });
};

const goBack = () => {
    router.back();
};
</script>

<style scoped>
.withdrawContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background: #f9f9f9;
}

.withdrawCard {
    background: #fff;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    max-width: 500px;
    text-align: center;
    animation: fadeIn 0.4s ease;
}

.withdrawCard h2 {
    font-size: 24px;
    margin-bottom: 16px;
    color: #333;
}

.description {
    font-size: 16px;
    margin-bottom: 20px;
    color: #666;
}

.suggestions {
    margin-bottom: 24px;
    background-color: #fafafa;
    padding: 16px;
    border-radius: 12px;
    color: #555;
    text-align: left;
}

.reasonInput {
    width: 100%;
    min-height: 80px;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    margin-bottom: 24px;
}

.buttonGroup {
    display: flex;
    justify-content: space-between;
}

.stayBtn,
.withdrawBtn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.2s;
}

.stayBtn {
    background-color: #cc8a94;
    color: #fff;
}

.withdrawBtn {
    background-color: #f0f0f0;
    color: #333;
}

.withdrawBtn:hover {
    background-color: #e0e0e0;
}

.stayBtn:hover {
    background-color: #ca717f;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
