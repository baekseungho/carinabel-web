<!-- views/AdminCreate.vue -->
<template>
    <div style="max-width: 400px; margin: 100px auto">
        <h2>관리자 계정 생성</h2>

        <div>
            <label>이름</label>
            <input type="text" v-model="fullName" />
        </div>
        <div>
            <label>회원번호</label>
            <input type="text" v-model="memberId" />
        </div>
        <div>
            <label>비밀번호</label>
            <input type="password" v-model="password" />
        </div>
        <button @click="handleAdmiCreate">생성</button>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import AdminService from "@/api/AdminService";

const router = useRoute();
const fullName = ref("");
const memberId = ref("");
const password = ref("");
const handleCreate = async () => {
    try {
        const res = await axios.post("http://localhost:5000/api/admin/create", {
            fullName: fullName.value,
            memberId: memberId.value,
            password: password.value,
        });
        alert("✅ 관리자 생성 성공: " + res.data.memberId);
    } catch (err) {
        alert("❌ 관리자 생성 실패: " + err.response?.data?.message);
    }
};

const handleAdmiCreate = () => {
    if (!memberId.value.trim()) {
        alert("관리자 ID를 입력해주세요.");
        return;
    }
    if (!password.value.trim()) {
        alert("비밀번호를 입력해주세요.");
        return;
    }

    const data = {
        fullName: fullName.value,
        memberId: memberId.value,
        password: password.value,
    };

    AdminService.adminCreate(data)
        .then((response) => {
            alert("✅ 관리자 생성 성공: " + response.data.memberId);
            router.push("/admin/login");
        })
        .catch((error) => {
            console.error(error);
            alert("❌ 관리자 생성 실패: " + error.response?.data?.message);
        });
};
</script>
