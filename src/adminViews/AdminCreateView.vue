<!-- views/AdminCreate.vue -->
<template>
    <div style="max-width: 400px; margin: 100px auto">
        <h2>관리자 계정 생성</h2>
        <form @submit.prevent="handleCreate">
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
            <button type="submit">생성</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

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
</script>
