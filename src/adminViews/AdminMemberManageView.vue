<template>
  <div class="adminMemberList">
    <h1 class="pageTitle">회원 리스트</h1>
    <table class="memberTable">
      <thead>
        <tr>
          <th>#</th>
          <th>이름</th>
          <th>이메일</th>
          <th>전화번호</th>
          <th>생년월일</th>
          <th>회원등급</th>
          <th>총 구매액</th>
          <th>총 추천 수당</th>
          <th>가입일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user._id">
          <td>{{ index + 1 }}</td>
          <td>{{ user.fullName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ formatDate(user.birthday) }}</td>
          <td>{{ user.membershipLevel }}</td>
          <td>{{ formatCurrency(user.totalPurchaseAmount) }}</td>
          <td>{{ formatCurrency(user.totalReferralEarnings) }}</td>
          <td>{{ formatDate(user.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

import AdminService from "@/api/AdminService";

const users = ref([]);
const token = localStorage.getItem("token");

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ko-KR");
};

const formatCurrency = (amount) => {
  return Number(amount).toLocaleString("ko-KR") + "원";
};

const fetchUsers = () => {
  AdminService.getAllUsers(token)
    .then((response) => {
      users.value = response.data;
    })
    .catch((err) => {
      console.error("❌ 사용자 목록 조회 실패:", err);
    });
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.adminMemberList {
  padding: 2rem;
  margin-left: 220px; /* 사이드바 고려 */
}

.pageTitle {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.memberTable {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
}

.memberTable th,
.memberTable td {
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 0.95rem;
}

.memberTable th {
  background-color: #f2f2f2;
  color: #333;
  font-weight: 600;
}
</style>
