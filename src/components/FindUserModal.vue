<template>
    <div class="modalWrapper" v-if="visible">
        <div class="modalOverlay" @click="closeModal"></div>
        <div class="modalContent">
            <div class="modalHeader">
                <h2>회원/비밀번호 찾기</h2>
                <button class="closeButton" @click="closeModal">✕</button>
            </div>

            <div class="tabButtons">
                <button :class="{ active: activeTab === 'memberId' }" @click="activeTab = 'memberId'">
                    회원번호 찾기
                </button>
                <button :class="{ active: activeTab === 'password' }" @click="activeTab = 'password'">
                    비밀번호 찾기
                </button>
            </div>

            <div v-if="activeTab === 'memberId'" class="tabContent">
                <div class="formGroup">
                    <label>이름</label>
                    <input v-model="fullName" placeholder="이름 입력" />
                </div>
                <div class="formGroup">
                    <label>휴대폰 번호</label>
                    <input v-model="phone" placeholder="예: 01012345678" />
                </div>
                <button @click="handleFindMemberId">회원번호 찾기</button>

                <div v-if="foundMemberId" class="resultBox">
                    {{ fullName }}님의 회원번호는 <strong>{{ foundMemberId }}</strong> 입니다.
                </div>
            </div>

            <div v-else class="tabContent">
                <div class="formGroup">
                    <label>회원번호</label>
                    <input v-model="resetMemberId" placeholder="회원번호 입력" />
                </div>
                <div class="formGroup">
                    <label>이름</label>
                    <input v-model="resetFullName" placeholder="이름 입력" />
                </div>
                <div class="formGroup">
                    <label>휴대폰 번호</label>
                    <input v-model="resetPhone" placeholder="예: 01012345678" />
                </div>
                <div class="formGroup">
                    <label>새 비밀번호</label>
                    <input v-model="newPassword" type="password" placeholder="새 비밀번호 입력" />
                </div>
                <div class="formGroup">
                    <label>비밀번호 확인</label>
                    <input v-model="confirmPassword" type="password" placeholder="비밀번호 확인" />
                </div>
                <button @click="handleResetPassword">비밀번호 재설정</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import AuthService from "@/api/AuthService";

const props = defineProps({
    visible: Boolean,
});
const emit = defineEmits(["close"]);

const activeTab = ref("memberId");
const fullName = ref("");
const phone = ref("");
const foundMemberId = ref("");
const resetMemberId = ref("");
const resetFullName = ref("");
const resetPhone = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const closeModal = () => {
    emit("close");
    // Reset state on close
    fullName.value = "";
    phone.value = "";
    foundMemberId.value = "";
    activeTab.value = "memberId";
};

const handleFindMemberId = () => {
    if (!fullName.value.trim() || !phone.value.trim()) {
        alert("이름과 휴대폰 번호를 모두 입력해주세요.");
        return;
    }

    AuthService.findMemberId({
        fullName: fullName.value.trim(),
        phone: phone.value.trim(),
    })
        .then((response) => {
            foundMemberId.value = response.data.memberId;
        })
        .catch((error) => {
            if (error.response?.status === 404) {
                alert("일치하는 회원 정보를 찾을 수 없습니다.");
            } else if (error.response?.status === 400) {
                alert("입력값이 부족합니다. 이름과 휴대폰 번호를 모두 입력해주세요.");
            } else {
                alert("회원번호 찾기에 실패했습니다. 잠시 후 다시 시도해주세요.");
            }
            foundMemberId.value = "";
        });
};

const handleResetPassword = () => {
    if (
        !resetMemberId.value.trim() ||
        !resetFullName.value.trim() ||
        !resetPhone.value.trim() ||
        !newPassword.value.trim() ||
        !confirmPassword.value.trim()
    ) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    AuthService.resetPassword({
        fullName: resetFullName.value.trim(),
        memberId: resetMemberId.value.trim(),
        phone: resetPhone.value.trim(),
        newPassword: newPassword.value,
    })
        .then((response) => {
            alert(response.data.message || "비밀번호가 성공적으로 변경되었습니다.");
            closeModal();
        })
        .catch((error) => {
            if (error.response?.status === 404) {
                alert("일치하는 회원 정보를 찾을 수 없습니다.");
            } else if (error.response?.status === 400) {
                alert("입력값이 누락되었습니다. 모든 항목을 다시 확인해주세요.");
            } else {
                alert("비밀번호 재설정에 실패했습니다. 잠시 후 다시 시도해주세요.");
            }
        });
};
</script>

<style scoped>
.modalWrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.modalOverlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
}
.modalContent {
    position: relative;
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    z-index: 1001;
}
.modalHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}
.tabButtons {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}
.tabButtons button {
    flex: 1;
    padding: 10px;
    border: none;
    background: #eee;
    cursor: pointer;
}
.tabButtons .active {
    background: #cc8a94;
    color: #fff;
}
.formGroup {
    margin-bottom: 12px;
}
.formGroup input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.resultBox {
    margin-top: 16px;
    background: #f2f2f2;
    padding: 10px;
    border-radius: 6px;
    text-align: center;
}
.closeButton {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}
</style>
