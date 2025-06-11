<template>
    <div class="loginPageContainer">
        <div class="loginBackground">
            <img src="/img/background_login.png" alt="Login Background" class="backgroundImage" />
            <div class="loginOverlay"></div>
        </div>
        <div class="loginContent">
            <div class="loginHeader">
                <img src="/img/logo2.png" alt="Logo" class="loginLogo" @click="goHome" />
            </div>
            <div class="loginFormContainer">
                <h2 class="loginTitle">로그인</h2>
                <form @submit.prevent="handleLogin">
                    <div class="inputGroup">
                        <label for="memberId">회원번호</label>
                        <input
                            type="text"
                            id="memberId"
                            v-model="memberIdOrId"
                            placeholder="회원번호를 입력하세요."
                            @keydown.enter="userLogin"
                        />
                    </div>
                    <div class="inputGroup passwordGroup">
                        <label for="password">비밀번호</label>
                        <div class="passwordWrapper">
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                id="password"
                                v-model="password"
                                placeholder="비밀번호를 입력하세요."
                                @keydown.enter="userLogin"
                            />
                            <span class="passwordToggle" @click="togglePassword">{{
                                showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                            }}</span>
                        </div>
                    </div>
                    <div class="optionsContainer">
                        <label class="rememberMeLabel">
                            <input type="checkbox" v-model="rememberMe" class="customCheckbox" />
                            <span class="customCheckboxLabel">아이디 저장</span>
                        </label>
                        <a href="#" class="forgotPasswordLink">비밀번호 설정/찾기</a>
                    </div>
                    <button type="submit" class="loginButton">로그인</button>
                </form>
                <button class="signupButton" @click="goSignup">회원가입</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router";
import { useStore } from "vuex";
import AuthService from "@/api/AuthService";
const store = useStore();
const memberIdOrId = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);

const goHome = () => {
    router.push("/");
};

const goSignup = () => {
    router.push("/signup");
};

const handleLogin = () => {
    if (!memberIdOrId.value.trim()) {
        alert("회원번호 또는 아이디를 입력해주세요.");
        return;
    }
    if (!password.value.trim()) {
        alert("비밀번호를 입력해주세요.");
        return;
    }

    const data = {
        memberIdOrId: memberIdOrId.value.trim(),
        password: password.value.trim(),
    };

    AuthService.login(data)
        .then((response) => {
            console.log("로그인 성공:", response.data);
            store.dispatch("login", response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            router.push("/");
        })
        .catch((error) => {
            console.error(error);
            alert("회원번호 또는 비밀번호를 확인해주세요.");
        });
};

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.loginPageContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f9f9f9;
    position: relative;
}

.loginBackground {
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

.loginOverlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
}

.loginContent {
    width: 400px;
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    z-index: 1;
    text-align: center;
}

.loginLogo {
    height: 50px;
    margin-bottom: 1.5rem;
    cursor: pointer;
}

.loginTitle {
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
}
.passwordWrapper {
    position: relative;
    font-size: 0.8rem;
    font-weight: 700;
}
.passwordToggle {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
    cursor: pointer;
}
.optionsContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.customCheckbox {
    display: none;
}

.customCheckboxLabel {
    position: relative;
    padding-left: 1.6rem;
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

.forgotPasswordLink {
    color: #cc8a94;
    text-decoration: none;
}

.forgotPasswordLink:hover {
    text-decoration: underline;
}

.loginButton {
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

.loginButton:hover {
    background-color: #b97a83;
}

.signupButton {
    width: 100%;
    padding: 0.75rem;
    background-color: #ffffff;
    color: #cc8a94;
    border: 2px solid #cc8a94;
    border-radius: 30px;
    font-weight: 700;
    margin-top: 1rem;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.signupButton:hover {
    background-color: #f4f4f4;
}
</style>
