<template>
    <div class="modalWrapper find-user-modal" v-if="visible" role="dialog" aria-modal="true" aria-labelledby="find-user-title">
        <div class="modalOverlay"></div>
        <div class="modalContent">
            <div class="modalHeader">
                <div><p>ACCOUNT SUPPORT</p><h2 id="find-user-title">회원정보 찾기</h2></div>
                <button class="closeButton" aria-label="닫기" @click="closeModal"><i class="fa-solid fa-xmark"></i></button>
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
<style>
.find-user-modal{position:fixed;inset:0;z-index:2000;display:grid;place-items:center;padding:20px}.find-user-modal .modalOverlay{position:absolute;inset:0;background:rgba(28,20,24,.65);backdrop-filter:blur(6px)}.find-user-modal .modalContent{position:relative;z-index:1;width:min(100%,480px);max-height:90vh;overflow-y:auto;padding:34px;border-radius:2px;background:#fff;box-shadow:0 25px 80px rgba(20,12,16,.3)}.find-user-modal .modalHeader{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px}.find-user-modal .modalHeader p{color:var(--color-accent);font-size:.59rem;font-weight:800;letter-spacing:.15em}.find-user-modal .modalHeader h2{margin-top:5px;font-family:Georgia,"Noto Serif KR",serif;font-size:1.65rem;font-weight:400}.find-user-modal .closeButton{width:34px;height:34px;border:0;background:#f7f4f2;color:#6f6469}.find-user-modal .tabButtons{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-bottom:25px;border-bottom:1px solid #ded6d9}.find-user-modal .tabButtons button{padding:12px;border:0;background:#fff;color:#968c91;font-size:.73rem}.find-user-modal .tabButtons button.active{border-bottom:2px solid var(--color-brand);color:var(--color-brand-dark);background:#fff;font-weight:800}.find-user-modal .formGroup{margin-bottom:15px}.find-user-modal .formGroup label{display:block;margin-bottom:6px;color:#60575b;font-size:.68rem;font-weight:700}.find-user-modal .formGroup input{width:100%;height:47px;padding:0 13px;border:1px solid #ddd5d8;border-radius:0;outline:0;font-size:.76rem}.find-user-modal .formGroup input:focus{border-color:var(--color-brand)}.find-user-modal .tabContent>button{width:100%;height:49px;margin-top:8px;border:0;color:#fff;background:var(--color-brand-dark);font-size:.76rem;font-weight:700}.find-user-modal .resultBox{margin-top:18px;padding:17px;border-radius:0;color:#665c61;background:var(--color-warm);font-size:.75rem;text-align:center}.find-user-modal .resultBox strong{color:var(--color-brand-dark)}@media(max-width:520px){.find-user-modal .modalContent{padding:27px 20px}}
</style>
