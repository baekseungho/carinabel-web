<template>
    <div class="adminOrderList">
        <h1 class="pageTitle">수당 관리</h1>
        <div class="filterBar">
            <input v-model="searchName" placeholder="이름 검색" />
            <input v-model="searchmemberId" placeholder="회원번호 검색" />
            <input v-model="searchBank" placeholder="은행명 검색" />
            <button @click="searchUsers">검색</button>
            <button class="downloadBtn" @click="downloadReferralExcel">엑셀 다운로드</button>
        </div>
        <table class="orderTable">
            <thead>
                <tr>
                    <th>회원명</th>
                    <th>회원번호</th>
                    <th>총 수당</th>
                    <th>지급 수당</th>
                    <th>미지급 수당</th>
                    <th>계좌번호</th>
                    <th>은행명</th>
                    <th>주민번호</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in referralList" :key="user._id" @click="() => openModal(user)" style="cursor: pointer">
                    <td>{{ user.fullName }}</td>
                    <td>{{ user.memberId }}</td>
                    <td>{{ format(user.totalReferralEarnings) }}원</td>
                    <td>{{ format(user.paidReferralEarnings) }}원</td>
                    <td>{{ format(user.unpaidReferralEarnings) }}원</td>
                    <td>{{ user.accountNumber || "-" }}</td>
                    <td>{{ user.bankName || "-" }}</td>
                    <td>{{ maskSsn(user.socialSecurityNumber) }}</td>
                </tr>
            </tbody>
        </table>
        <Pagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
        />
        <RefferalModal
            v-if="showModal"
            :user="selectedUser"
            :token="token"
            @close="showModal = false"
            @updated="handleUpdated"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminService from "@/api/AdminService";
import RefferalModal from "@/components/admin/RefferalModal.vue";
import Pagination from "@/components/common/Pagination.vue";
import * as XLSX from "xlsx";
const referralList = ref([]);
const showModal = ref(false);
const selectedUser = ref("");
const searchName = ref("");
const searchmemberId = ref("");
const searchBank = ref("");
const currentPage = ref(1);
const pageSize = 20;
const totalPages = ref(1);
const token = JSON.parse(localStorage.getItem("user"))?.token;

const format = (value) => {
    if (!value) return "0";
    return value.toLocaleString();
};

const maskSsn = (ssn) => {
    if (!ssn || ssn.length < 7) return "-";
    return ssn.substring(0, 7) + "******";
};
const searchUsers = () => {
    const params = {
        name: searchName.value,
        memberId: searchmemberId.value,
        bankName: searchBank.value,
        page: currentPage.value,
        size: pageSize,
    };

    AdminService.getReferralEarningsList(token, params)
        .then((res) => {
            referralList.value = res.data.users;
            totalPages.value = Math.ceil(res.data.total / pageSize);
        })
        .catch((err) => {
            console.error("❌ 수당 목록 조회 실패:", err);
            alert("수당 목록을 불러오는 데 실패했습니다.");
        });
};

onMounted(() => {
    searchUsers();
});
const formatPrice = (val) => {
    if (typeof val !== "number" || isNaN(val)) return "0";
    return val.toLocaleString();
};
const downloadReferralExcel = async () => {
    try {
        const params = {
            name: searchName.value,
            memberId: searchmemberId.value,
            bankName: searchBank.value,
            page: 1,
            size: 10000, // 충분히 큰 값으로 전체 조회
        };

        const res = await AdminService.getReferralEarningsList(token, params);
        // ✅ 배열인지 확인 후 처리
        const data = Array.isArray(res.data.users) ? res.data.users : Array.isArray(res.data) ? res.data : [];
        console.log(data);
        if (!data.length) {
            alert("다운로드할 데이터가 없습니다.");
            return;
        }

        const excelData = referralList.value.map((user, idx) => ({
            번호: idx + 1,
            이름: user.fullName,
            회원번호: user.memberId,
            총수당: typeof user.totalReferralEarnings === "number" ? user.totalReferralEarnings : 0,
            지급수당: typeof user.paidReferralEarnings === "number" ? user.paidReferralEarnings : 0,
            미지급수당: typeof user.unpaidReferralEarnings === "number" ? user.unpaidReferralEarnings : 0,
            계좌번호: user.accountNumber || "-",
            은행명: user.bankName || "-",
            주민번호: user.socialSecurityNumber ? user.socialSecurityNumber.substring(0, 7) + "******" : "-",
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "수당리스트");

        const today = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(workbook, `수당리스트_${today}.xlsx`);
    } catch (err) {
        console.error("❌ 수당 엑셀 다운로드 실패:", err);
        alert("엑셀 다운로드 중 오류가 발생했습니다.");
    }
};

const handlePageChange = (page) => {
    currentPage.value = page;
    searchUsers();
};

const openModal = (user) => {
    selectedUser.value = user;
    showModal.value = true;
};

const handleUpdated = () => {
    showModal.value = false;
    searchUsers(); // 지급 후 수당 데이터 새로고침
};
</script>

<style scoped>
.adminOrderList {
    padding: 2rem;
    margin-left: 220px;
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
.pageTitle {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
}

.orderTable {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
}

.orderTable th,
.orderTable td {
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    text-align: center;
    font-size: 0.95rem;
}
.orderTable tr:hover {
    background: #eee;
}
.orderTable th {
    background-color: #f2f2f2;
    color: #333;
    font-weight: 600;
}
</style>
