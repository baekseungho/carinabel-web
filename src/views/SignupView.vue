<template>
  <div class="signupPageContainer">
    <div class="signupBackground">
      <img
        src="/img/background_login.png"
        alt="Signup Background"
        class="backgroundImage"
      />
      <div class="signupOverlay"></div>
    </div>
    <div class="signupContent">
      <div class="signupHeader">
        <img
          src="/img/logo2.png"
          alt="Logo"
          class="signupLogo"
          @click="goHome"
        />
      </div>
      <div class="signupFormContainer">
        <h2 class="signupTitle">회원가입</h2>
        <form @submit.prevent="handleSignup">
          <div class="inputGroup">
            <label for="fullName">이름</label>
            <input
              type="text"
              id="fullName"
              v-model="fullName"
              placeholder="이름을 입력하세요."
            />
          </div>
          <div class="inputGroup">
            <label for="email">이메일</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="이메일 주소를 입력하세요."
            />
          </div>
          <div class="inputGroup">
            <label for="phone">휴대폰 번호</label>
            <input
              type="text"
              id="phone"
              v-model="phone"
              placeholder="휴대폰 번호를 입력하세요."
            />
          </div>
          <div class="inputGroup">
            <label for="birthday">생년월일</label>
            <input
              type="date"
              id="birthday"
              v-model="birthday"
              placeholder="생년월일을 입력하세요."
            />
          </div>
          <div class="inputGroup">
            <label for="password">비밀번호</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="비밀번호를 입력하세요."
            />
          </div>
          <div class="inputGroup">
            <label for="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요."
            />
          </div>
          <div class="optionsContainer">
            <label class="termsLabel">
              <input
                type="checkbox"
                v-model="agreedToTerms"
                class="customCheckbox"
              />
              <span class="customCheckboxLabel"
                >이용약관 및 개인정보 처리방침에 동의합니다.</span
              >
            </label>
          </div>
          <button type="submit" class="signupButton">회원가입</button>
        </form>
        <p class="loginPrompt">
          이미 계정이 있으신가요? <a href="/login" class="loginLink">로그인</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router";
import AuthService from "@/api/AuthService";

const fullName = ref("");
const email = ref("");
const phone = ref("");
const birthday = ref("");
const password = ref("");
const confirmPassword = ref("");
const agreedToTerms = ref(false);

const goHome = () => {
  router.push("/");
};

const handleSignup = () => {
  if (!fullName.value.trim()) {
    alert("이름을 입력해주세요.");
    return;
  }
  if (
    !email.value.trim() ||
    !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value.trim())
  ) {
    alert("유효한 이메일 주소를 입력해주세요.");
    return;
  }
  if (!phone.value.trim() || !/^01[0-9]{8,9}$/.test(phone.value.trim())) {
    alert("유효한 휴대폰 번호를 입력해주세요. (예: 01012345678)");
    return;
  }
  if (!birthday.value.trim()) {
    alert("생년월일을 입력해주세요.");
    return;
  }
  if (password.value.length < 6) {
    alert("비밀번호는 최소6자리여야 합니다.");
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }
  if (!agreedToTerms.value) {
    alert("이용약관 및 개인정보 처리방침에 동의해주세요.");
    return;
  }

  // 회원가입 요청
  const data = {
    fullName: fullName.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    birthday: birthday.value.trim(),
    password: password.value.trim(),
    agreedToTerms: agreedToTerms.value,
  };

  AuthService.register(data)
    .then((response) => {
      console.log("회원가입 성공:", response.data);
      alert("회원가입이 완료되었습니다.");
      router.push("/login");
    })
    .catch((error) => {
      console.error(error);
      alert("회원가입에 실패했습니다.");
    });
};
</script>

<style scoped>
.signupPageContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  position: relative;
}

.signupBackground {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.backgroundImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(70%);
}

.signupOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.signupContent {
  width: 500px;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  z-index: 1;
  text-align: center;
}

.signupLogo {
  height: 50px;
  margin-bottom: 1.5rem;
  cursor: pointer;
}

.signupTitle {
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #cc8a94;
  font-weight: 700;
}

.inputGroup {
  margin-bottom: 1.5rem;
  text-align: left;
}

.inputGroup label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.inputGroup input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease-in-out;
}

.inputGroup input:focus {
  border-color: #cc8a94;
  box-shadow: 0 0 0 2px rgba(204, 138, 148, 0.3);
}

.customCheckbox {
  display: none;
}
.optionsContainer {
  margin-bottom: 1.6rem;
}
.customCheckboxLabel {
  position: relative;
  padding-left: 2rem;
  cursor: pointer;
  font-weight: 600;
  color: #333;
}

.customCheckboxLabel::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background-color: #fff;
  border: 2px solid #cc8a94;
  transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
}

.customCheckbox:checked + .customCheckboxLabel::before {
  background-color: #cc8a94;
  border-color: #cc8a94;
  background-image: url("/img/check-icon.svg");
  background-size: 12px 12px;
  background-repeat: no-repeat;
  background-position: center;
}

.signupButton {
  width: 100%;
  padding: 0.75rem;
  background-color: #cc8a94;
  color: #ffffff;
  border: none;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.signupButton:hover {
  background-color: #b97a83;
}

.loginPrompt {
  margin-top: 1rem;
  color: #333;
}

.loginLink {
  color: #cc8a94;
  text-decoration: none;
  font-weight: 700;
  cursor: pointer;
}

.loginLink:hover {
  text-decoration: underline;
}
</style>
