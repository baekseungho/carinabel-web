<template>
    <div class="adminOrderList">
        <h1 class="pageTitle">주문 리스트</h1>

        <div class="filterSection">
            <input v-model="filters.productName" type="text" placeholder="상품명" />
            <input v-model="filters.name" type="text" placeholder="사용자 이름" />
            <input v-model="filters.email" type="text" placeholder="이메일" />
            <button @click="fetchOrders(1)">검색</button>
            <div class="excelButtons">
                <button @click="downloadCurrentPageOrders">현재페이지 엑셀</button>
                <button @click="downloadAllOrders">전체 엑셀</button>
            </div>
        </div>

        <table class="orderTable">
            <thead>
                <tr>
                    <th>#</th>
                    <th>주문일시</th>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>상품명</th>
                    <th>수량</th>
                    <th>가격</th>
                    <th>상태</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, index) in orders" :key="order._id">
                    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                    <td>{{ formatDate(order.createdAt) }}</td>
                    <td>{{ order.userId.fullName }}</td>
                    <td>{{ order.userId.email }}</td>
                    <td>{{ order.productName }}</td>
                    <td>{{ order.quantity }}</td>
                    <td>{{ formatCurrency(order.amount) }}</td>
                    <td>{{ order.status }}</td>
                </tr>
            </tbody>
        </table>

        <Pagination
            v-if="totalPages > 1"
            :currentPage="currentPage"
            :totalPages="totalPages"
            @page-change="fetchOrders"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminService from "@/api/AdminService";
import Pagination from "@/components/common/Pagination.vue";
import * as XLSX from "xlsx";

const orders = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = 20;
const totalPages = ref(1);
const token = localStorage.getItem("token");

const filters = ref({
    productName: "",
    name: "",
    email: "",
});

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("ko-KR");
};

const formatCurrency = (amount) => {
    return Number(amount).toLocaleString("ko-KR") + "원";
};

const fetchOrders = (page = 1) => {
    currentPage.value = page;
    AdminService.getAllOrders(token, {
        page,
        size: pageSize,
        ...filters.value,
    })
        .then((res) => {
            orders.value = res.data.orders;
            total.value = res.data.total;
            totalPages.value = Math.ceil(total.value / pageSize);
        })
        .catch((err) => {
            console.error("❌ 주문 조회 실패:", err);
        });
};

const downloadAllOrders = async () => {
    try {
        const res = await AdminService.getAllOrders(token, {
            page: 1,
            size: 10000,
            ...filters.value,
        });

        const data = res.data.orders.map((order, idx) => ({
            번호: idx + 1,
            주문일시: formatDate(order.createdAt),
            이름: order.userId.fullName,
            이메일: order.userId.email,
            상품명: order.productName,
            수량: order.quantity,
            가격: order.amount,
            상태: order.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "전체주문리스트");

        const today = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(workbook, `전체주문리스트_${today}.xlsx`);
    } catch (err) {
        console.error("❌ 전체 주문 엑셀 다운로드 실패:", err);
        alert("전체 주문 다운로드 중 오류가 발생했습니다.");
    }
};

const downloadCurrentPageOrders = () => {
    const data = orders.value.map((order, idx) => ({
        번호: (currentPage.value - 1) * pageSize + idx + 1,
        주문일시: formatDate(order.createdAt),
        이름: order.userId.fullName,
        이메일: order.userId.email,
        상품명: order.productName,
        수량: order.quantity,
        가격: order.amount,
        상태: order.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "주문리스트");

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `주문리스트_페이지${currentPage.value}_${today}.xlsx`);
};

onMounted(() => {
    fetchOrders();
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

.filterSection {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.filterSection input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.95rem;
}

.filterSection button {
    padding: 0.5rem 1rem;
    background-color: #cc8a94;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}
.filterSection button:hover {
    background-color: #a0666f;
}
.excelButtons {
    margin-left: auto;
    display: flex;
    gap: 8px;
}
.excelButtons button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    background: #444;
    color: white;
    cursor: pointer;
}
.excelButtons button:hover {
    background-color: #333;
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
