<!-- components/user/EditAccountModal.vue -->
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
          <label for="socialSecurityNumber">주민번호 (앞 6자리만)</label>
          <input
            v-model="ssn"
            id="socialSecurityNumber"
            maxlength="6"
            pattern="\\d{6}"
            required
          />
        </div>
        <div class="modalActions">
          <button type="submit" class="confirmBtn">저장</button>
          <button type="button" class="cancelBtn" @click="$emit('close')">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import UserService from "@/api/UserService";

const props = defineProps({});
const emit = defineEmits(["close", "updated"]);

const user = JSON.parse(localStorage.getItem("user"));
const token = user?.token;

const bankName = ref("");
const accountNumber = ref("");
const ssn = ref("");

const updateAccountInfo = () => {
  UserService.updateBankInfo(
    {
      bankName: bankName.value,
      accountNumber: accountNumber.value,
      ssn: ssn.value,
    },
    token
  )
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
