<template>
    <div class="loginPageContainer">
        <div class="loginBackground">
            <img src="/img/background_adminlogin.png" alt="Admin Login Background" class="backgroundImage" />
            <div class="loginOverlay"></div>
        </div>
        <div class="loginContent">
            <div class="loginHeader">
                <img src="/img/logo2.png" alt="Logo" class="loginLogo" @click="goHome" />
            </div>
            <div class="loginFormContainer">
                <h2 class="loginTitle">관리자 로그인</h2>
                <form @submit.prevent="handleAdminLogin">
                    <div class="inputGroup">
                        <label for="adminId">관리자 ID</label>
                        <input type="text" id="adminId" v-model="adminId" placeholder="관리자 ID를 입력하세요." />
                    </div>
                    <div class="inputGroup passwordGroup">
                        <label for="adminPassword">비밀번호</label>
                        <div class="passwordWrapper">
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                id="adminPassword"
                                v-model="adminPassword"
                                placeholder="비밀번호를 입력하세요."
                            />
                            <span class="passwordToggle" @click="togglePassword">
                                {{ showPassword ? "비밀번호 숨기기" : "비밀번호 보기" }}
                            </span>
                        </div>
                    </div>
                    <button type="submit" class="loginButton">로그인</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router";
import AdminService from "@/api/AdminService";
const adminId = ref("");
const adminPassword = ref("");
const showPassword = ref(false);

const goHome = () => {
    router.push("/");
};

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const handleAdminLogin = () => {
    if (!adminId.value.trim()) {
        alert("관리자 ID를 입력해주세요.");
        return;
    }
    if (!adminPassword.value.trim()) {
        alert("비밀번호를 입력해주세요.");
        return;
    }

    const data = {
        adminId: adminId.value.trim(),
        password: adminPassword.value.trim(),
    };

    AdminService.adminLogin(data)
        .then((response) => {
            console.log("로그인 성공:", response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("token", response.data.token);

            router.push("/admin/dashboard");
        })
        .catch((error) => {
            console.error(error);
            alert("회원번호 또는 비밀번호를 확인해주세요.");
        });
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
    outline: none;
    transition: border-color 0.3s ease-in-out;
}

.inputGroup input:focus {
    border-color: #cc8a94;
    box-shadow: 0 0 0 2px rgba(204, 138, 148, 0.3);
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
</style>
