<template>
    <div class="adminOrderList">
        <h1 class="pageTitle">수당 관리</h1>

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
                <tr v-for="user in referralList" :key="user._id">
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
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminService from "@/api/AdminService";

const referralList = ref([]);

const format = (value) => {
    if (!value) return "0";
    return value.toLocaleString();
};

const maskSsn = (ssn) => {
    if (!ssn || ssn.length < 7) return "-";
    return ssn.substring(0, 7) + "******";
};

onMounted(() => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (!token) return alert("인증 정보가 없습니다.");

    AdminService.getReferralEarningsList(token)
        .then((res) => {
            referralList.value = res.data;
        })
        .catch((err) => {
            console.error("❌ 수당 목록 조회 실패:", err);
            alert("수당 목록을 불러오는 데 실패했습니다.");
        });
});
</script>

<style scoped>
.adminOrderList {
    padding: 2rem;
    margin-left: 220px;
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

.orderTable th {
    background-color: #f2f2f2;
    color: #333;
    font-weight: 600;
}
</style>
