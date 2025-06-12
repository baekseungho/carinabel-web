<template>
    <div class="adminMemberList">
        <h1 class="pageTitle">회원 리스트</h1>

        <!-- 🔍 검색 필터 영역 -->
        <div class="filterBar">
            <div class="date-filter">
                <input style="height: 44px" type="date" v-model="fromDate" />
                ~
                <input style="height: 44px" type="date" v-model="toDate" />
            </div>
            <input v-model="searchName" placeholder="이름 검색" />
            <input v-model="searchmemberId" placeholder="회원번호 검색" />
            <select v-model="selectedLevel">
                <option value="">전체</option>
                <option>일반회원</option>
                <option>회원</option>
                <option>대리점</option>
                <option>총판</option>
            </select>
            <button @click="searchUsers">검색</button>
            <button class="downloadBtn" @click="downloadExcel">엑셀 다운로드</button>
        </div>

        <table class="memberTable">
            <thead>
                <tr>
                    <th>#</th>
                    <th>이름</th>
                    <th>회원번호</th>
                    <th>전화번호</th>
                    <th>생년월일</th>
                    <th>회원등급</th>
                    <th>추천인 이름</th>
                    <th>추천인 회원번호</th>
                    <th>주소</th>
                    <th>가입일</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in users" :key="user._id">
                    <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
                    <td>{{ user.fullName }}</td>
                    <td>{{ user.memberId }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ formatDate(user.birthday) }}</td>
                    <td>{{ user.membershipLevel }}</td>
                    <td>{{ user.referrerName }}</td>
                    <td>{{ user.referrerMemberId }}</td>
                    <td>{{ user.address }}</td>
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
import * as XLSX from "xlsx";

const users = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const fromDate = ref("");
const toDate = ref("");
const pageSize = 20;

const searchName = ref("");
const searchmemberId = ref("");
const selectedLevel = ref("");

const token = localStorage.getItem("token");

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
};

const fetchUsers = () => {
    const params = {
        name: searchName.value,
        memberId: searchmemberId.value,
        level: selectedLevel.value,
        page: currentPage.value,
        size: pageSize,
        fromDate: fromDate.value || null,
        toDate: toDate.value || null,
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

const downloadExcel = async () => {
    try {
        const params = {
            name: searchName.value,
            memberId: searchmemberId.value,
            level: selectedLevel.value,
            page: 1,
            size: 10000, // 충분히 큰 숫자로 전체 조회
        };
        const res = await AdminService.getFilteredUsers(params, token);
        const data = res.data.users.map((user, idx) => ({
            번호: idx + 1,
            이름: user.fullName,
            회원번호: user.memberId,
            전화번호: user.phone,
            생년월일: formatDate(user.birthday),
            회원등급: user.membershipLevel,
            추천인이름: user.referrerName,
            추천인회원번호: user.referrerMemberId,
            주소: user.address,
            가입일: formatDate(user.createdAt),
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "회원리스트");

        const today = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(workbook, `회원리스트_${today}.xlsx`);
    } catch (err) {
        console.error("❌ 엑셀 다운로드 실패:", err);
        alert("엑셀 다운로드 중 오류가 발생했습니다.");
    }
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
.downloadBtn {
    margin-left: auto;
    background: #444;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.downloadBtn:hover {
    background-color: #333;
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
</style>
