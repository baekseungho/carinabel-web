<template>
    <div class="modalOverlay">
        <div class="modalContent">
            <h3>계좌정보 수정</h3>
            <form @submit.prevent="updateAccountInfo">
                <div class="formGroup">
                    <label for="bankName">은행명</label>
                    <input v-model="bankName" id="bankName" required />
                </div>
                <div class="formGroup">
                    <label for="accountNumber">계좌번호</label>
                    <input v-model="accountNumber" id="accountNumber" required />
                </div>
                <div class="formGroup">
                    <label for="ssn">주민등록번호</label>
                    <div class="ssnGroup">
                        <input v-model="ssnFront" maxlength="6" pattern="\d{6}" required placeholder="앞자리 6자리" />
                        <span class="hyphen">-</span>
                        <input
                            v-model="ssnBack"
                            maxlength="7"
                            pattern="\d{7}"
                            required
                            placeholder="뒤 7자리"
                            type="password"
                        />
                    </div>
                </div>
                <div class="modalActions">
                    <button type="submit" class="confirmBtn">저장</button>
                    <button type="button" class="cancelBtn" @click="$emit('close')">취소</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import UserService from "@/api/UserService";

const emit = defineEmits(["close", "updated"]);
const user = JSON.parse(localStorage.getItem("user"));
const token = user?.token;

const bankName = ref("");
const accountNumber = ref("");
const ssnFront = ref("");
const ssnBack = ref("");

const updateAccountInfo = () => {
    const ssn = ssnFront.value + ssnBack.value;
    let data = {
        bankName: bankName.value,
        accountNumber: accountNumber.value,
        socialSecurityNumber: ssn,
    };
    if (!/^\d{13}$/.test(ssn)) {
        alert("주민등록번호를 정확히 입력해주세요.");
        return;
    }

    UserService.updateBankInfo(data, token)
        .then(() => {
            alert("계좌정보가 성공적으로 업데이트되었습니다.");
            emit("updated");
            emit("close");
        })
        .catch((err) => {
            console.error("❌ 계좌정보 업데이트 실패:", err);
            alert("계좌정보를 업데이트하는 데 실패했습니다.");
        });
};
</script>

<style scoped>
.modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modalContent {
    background: #fff;
    padding: 2rem;
    border-radius: 16px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    animation: fadeInUp 0.3s ease;
}

.modalContent h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
}

.formGroup {
    margin-bottom: 1.2rem;
}

.formGroup label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #444;
}

.formGroup input {
    width: 100%;
    padding: 0.6rem 0.9rem;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 1rem;
    transition: 0.2s;
}

.formGroup input:focus {
    border-color: #f36d3b;
    outline: none;
}

.ssnGroup {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.ssnGroup input {
    flex: 1;
}

.hyphen {
    font-size: 1.1rem;
    color: #888;
}

.modalActions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1.5rem;
}

.confirmBtn,
.cancelBtn {
    flex: 1;
    padding: 0.6rem 0;
    font-size: 1rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.2s;
}

.confirmBtn {
    background-color: #cc8a94;
    color: white;
}

.confirmBtn:hover {
    background-color: #ca717f;
}

.cancelBtn {
    background-color: #e0e0e0;
}

.cancelBtn:hover {
    background-color: #cfcfcf;
}

@keyframes fadeInUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
