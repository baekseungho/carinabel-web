<template>
  <main class="admin-create-page">
    <section class="create-panel">
      <RouterLink to="/admin/dashboard" class="back-link"><i class="fa-solid fa-arrow-left"></i> 관리자 대시보드</RouterLink>
      <header><p>ADMIN ACCOUNT</p><h1>관리자 계정 생성</h1><span>운영 권한이 필요한 담당자의 계정을 생성합니다.</span></header>
      <div class="security-note"><i class="fa-solid fa-shield-halved"></i><p><strong>권한 부여 전 확인해 주세요.</strong><span>관리자 계정은 회원·주문·결제 관련 정보에 접근할 수 있습니다.</span></p></div>
      <form autocomplete="off" @submit.prevent="createAdmin">
        <label><span>담당자 이름 *</span><input v-model.trim="form.fullName" required placeholder="이름"></label>
        <label><span>관리자 ID *</span><input v-model.trim="form.memberId" required minlength="4" autocomplete="off" placeholder="4자 이상"></label>
        <label><span>초기 비밀번호 *</span><div class="password-field"><input v-model="form.password" :type="showPassword?'text':'password'" required minlength="8" autocomplete="new-password" placeholder="8자 이상"><button type="button" :aria-label="showPassword?'비밀번호 숨기기':'비밀번호 보기'" @click="showPassword=!showPassword"><i :class="showPassword?'fa-regular fa-eye-slash':'fa-regular fa-eye'"></i></button></div></label>
        <label><span>비밀번호 확인 *</span><input v-model="form.confirmPassword" type="password" required minlength="8" autocomplete="new-password" placeholder="비밀번호 다시 입력"></label>
        <p v-if="errorMessage" class="form-error"><i class="fa-solid fa-circle-exclamation"></i>{{ errorMessage }}</p>
        <button class="submit-button" :disabled="submitting">{{ submitting?'계정 생성 중...':'관리자 계정 생성' }}</button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AdminService from "@/api/AdminService";
import { getStoredToken } from "@/utils/storage";

const router = useRouter();
const form = reactive({ fullName: "", memberId: "", password: "", confirmPassword: "" });
const showPassword = ref(false), submitting = ref(false), errorMessage = ref("");

async function createAdmin() {
  errorMessage.value = "";
  if (!form.fullName || form.memberId.length < 4) return errorMessage.value = "이름과 4자 이상의 관리자 ID를 입력해 주세요.";
  if (form.password.length < 8) return errorMessage.value = "비밀번호는 8자 이상 입력해 주세요.";
  if (form.password !== form.confirmPassword) return errorMessage.value = "비밀번호가 서로 일치하지 않습니다.";
  if (!confirm(`${form.fullName} 담당자에게 관리자 권한을 부여하시겠습니까?`)) return;
  submitting.value = true;
  try {
    const { data } = await AdminService.adminCreate({ fullName: form.fullName, memberId: form.memberId, password: form.password }, getStoredToken());
    alert(`관리자 계정이 생성되었습니다.\n관리자 ID: ${data.memberId || form.memberId}`);
    router.replace("/admin/dashboard");
  } catch (error) {
    console.error("관리자 계정 생성 실패:", error);
    errorMessage.value = error.response?.data?.message || "관리자 계정을 생성하지 못했습니다.";
  } finally { submitting.value = false; }
}
</script>

<style scoped>
.admin-create-page{min-height:100vh;display:grid;place-items:center;padding:40px 20px;color:#302a2d;background:linear-gradient(135deg,#f2ece9,#faf8f6);font-family:"Pretendard","Noto Sans KR",sans-serif}.create-panel{width:min(480px,100%);padding:34px;border:1px solid #e1d8d5;background:#fff;box-shadow:0 24px 70px rgba(50,34,42,.1)}.back-link{display:inline-flex;align-items:center;gap:8px;margin-bottom:27px;color:#786c71;font-size:.68rem}.create-panel header p{color:#a46f7b;font-size:.6rem;font-weight:800;letter-spacing:.18em}.create-panel h1{margin:6px 0;font-family:Georgia,"Noto Serif KR",serif;font-size:2rem;font-weight:400}.create-panel header span{color:#8e8388;font-size:.72rem}.security-note{display:flex;align-items:flex-start;gap:11px;margin:23px 0;padding:13px;color:#725b63;background:#f7eff1}.security-note i{margin-top:3px;color:#9c6875}.security-note p{display:grid;margin:0;font-size:.68rem}.security-note span{color:#92868b;font-size:.6rem}.create-panel form,.create-panel label{display:grid;gap:7px}.create-panel form{gap:14px}.create-panel label>span{font-size:.66rem;font-weight:700}.create-panel input{width:100%;height:43px;padding:0 11px;border:1px solid #dcd3d0;box-sizing:border-box;outline:none}.create-panel input:focus{border-color:#866577;box-shadow:0 0 0 3px rgba(134,101,119,.1)}.password-field{position:relative}.password-field input{padding-right:42px}.password-field button{position:absolute;right:0;top:0;width:42px;height:43px;border:0;color:#8d8287;background:transparent}.form-error{padding:10px;color:#9c4d4d;background:#fbefef;font-size:.65rem}.form-error i{margin-right:6px}.submit-button{height:46px;border:0;color:#fff;background:#563f4c;font-weight:700}.submit-button:hover:not(:disabled){background:#45313b}@media(max-width:520px){.admin-create-page{padding:0}.create-panel{min-height:100vh;padding:28px 20px;border:0}}
</style>
