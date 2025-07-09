<template>
    <div class="adminMemberList">
        <h1 class="pageTitle">탈퇴 회원 관리</h1>

        <!-- 🔍 검색 필터 영역 -->
        <div class="filterBar">
            <div class="date-filter">
                <input style="height: 44px" type="date" v-model="fromDate" />
                ~
                <input style="height: 44px" type="date" v-model="toDate" />
            </div>
            <input v-model="searchName" placeholder="이름 검색" />
            <input v-model="searchMemberId" placeholder="회원번호 검색" />
            <button @click="searchUsers">검색</button>
        </div>

        <table class="memberTable">
            <thead>
                <tr>
                    <th>이름</th>
                    <th>회원번호</th>
                    <th>전화번호</th>
                    <th>생년월일</th>
                    <th>회원등급</th>
                    <th>추천인 이름</th>
                    <th>추천인 회원번호</th>
                    <th>탈퇴일</th>
                    <th>탈퇴 사유</th>
                    <th>관리</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user._id">
                    <td>{{ user.fullName }}</td>
                    <td>{{ user.memberId }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ formatDate(user.birthday) }}</td>
                    <td>{{ user.membershipLevel }}</td>
                    <td>{{ user.referrerName }}</td>
                    <td>{{ user.referrerMemberId }}</td>
                    <td>{{ formatDate(user.deletedAt) }}</td>
                    <td>{{ user.deleteReason || "-" }}</td>
                    <td>
                        <button @click="restoreUser(user._id)">복구</button>
                    </td>
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
const fromDate = ref("");
const toDate = ref("");
const pageSize = 20;
const searchName = ref("");
const searchMemberId = ref("");

const token = localStorage.getItem("token");

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
};

const fetchUsers = () => {
    const params = {
        name: searchName.value,
        memberId: searchMemberId.value,
        page: currentPage.value,
        size: pageSize,
        fromDate: fromDate.value || null,
        toDate: toDate.value || null,
    };

    AdminService.getWithdrawnUsers(params, token)
        .then((res) => {
            users.value = res.data.users;
            totalCount.value = res.data.total;
        })
        .catch((err) => console.error("❌ 탈퇴 회원 조회 실패:", err));
};

const searchUsers = () => {
    currentPage.value = 1;
    fetchUsers();
};

const handlePageChange = (page) => {
    currentPage.value = page;
    fetchUsers();
};

const restoreUser = (userId) => {
    if (!confirm("이 회원을 복구하시겠습니까?")) return;

    AdminService.restoreUser(userId, token)
        .then(() => {
            alert("복구가 완료되었습니다.");
            fetchUsers();
        })
        .catch((err) => {
            console.error("❌ 복구 실패:", err);
            alert("복구 중 오류가 발생했습니다.");
        });
};

onMounted(() => {
    fetchUsers();
});
</script>

<style scoped>
/* 기존 스타일 그대로 사용 */
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

button {
    padding: 8px 16px;
    background-color: #cc8a94;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #a0666f;
}

.filterBar input {
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
</style>
