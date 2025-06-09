<template>
    <div class="adminMemberList">
        <h1 class="pageTitle">회원 리스트</h1>

        <!-- 🔍 검색 필터 영역 -->
        <div class="filterBar">
            <input v-model="searchName" placeholder="이름 검색" />
            <input v-model="searchEmail" placeholder="이메일 검색" />
            <select v-model="selectedLevel">
                <option value="">전체</option>
                <option>일반회원</option>
                <option>회원</option>
                <option>대리점</option>
                <option>총판</option>
            </select>
            <button @click="searchUsers">검색</button>
        </div>

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
                    <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
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

        <Pagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AdminService from "@/api/AdminService";
import Pagination from "@/components/common/Pagination.vue";

const users = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 20;

const searchName = ref("");
const searchEmail = ref("");
const selectedLevel = ref("");

const token = localStorage.getItem("token");

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
};

const formatCurrency = (amount) => Number(amount).toLocaleString("ko-KR") + "원";

const fetchUsers = () => {
    const params = {
        name: searchName.value,
        email: searchEmail.value,
        level: selectedLevel.value,
        page: currentPage.value,
        size: pageSize,
    };

    AdminService.getFilteredUsers(params, token)
        .then((res) => {
            users.value = res.data.users;
            totalCount.value = res.data.total;
        })
        .catch((err) => console.error("❌ 사용자 목록 조회 실패:", err));
};

const searchUsers = () => {
    currentPage.value = 1;
    fetchUsers();
};

const handlePageChange = (page) => {
    currentPage.value = page;
    fetchUsers();
};

onMounted(() => {
    fetchUsers();
});
</script>

<style scoped>
.adminMemberList {
    padding: 2rem;
    margin-left: 220px;
}
.pageTitle {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
}
.filterBar {
    margin-bottom: 1.2rem;
    display: flex;
    gap: 1rem;
}
.filterBar input,
.filterBar select {
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
}
.memberTable {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
}
.memberTable th,
.memberTable td {
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    text-align: center;
}
.memberTable th {
    background-color: #f2f2f2;
    color: #333;
    font-weight: 600;
}
button {
    /* margin: 10px; */
    padding: 10px 20px;
    background-color: #cc8a94;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #a0666f;
}
</style>
