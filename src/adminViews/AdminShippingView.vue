<template>
  <div class="adminOrderStatus">
    <h1 class="pageTitle">배송 상태 관리</h1>

    <div class="filterBar">
      <input v-model="searchName" placeholder="회원명 검색" />
      <input v-model="searchOrderNumber" placeholder="주문번호 검색" />
      <select v-model="searchStatus">
        <option value="">전체 상태</option>
        <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
      </select>
      <button @click="fetchOrders">검색</button>
    </div>

    <table class="orderTable">
      <thead>
        <tr>
          <th>주문번호</th>
          <th>회원명</th>
          <th>상품명</th>
          <th>수량</th>
          <th>결제금액</th>
          <th>주문일</th>
          <th>상태</th>
          <th>상태 변경</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order._id">
          <td>{{ order.orderNumber }}</td>
          <td>{{ order.userId.fullName }}</td>
          <td>{{ order.productName }}</td>
          <td>{{ order.quantity }}</td>
          <td>{{ format(order.amount) }}원</td>
          <td>{{ formatDate(order.createdAt) }}</td>
          <td>{{ order.status }}</td>
          <td>
            <select v-model="order.status">
              <option v-for="s in statusOptions" :key="s" :value="s">
                {{ s }}
              </option>
            </select>
            <button @click="updateStatus(order)">변경</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminService from "@/api/AdminService";

const orders = ref([]);
const searchName = ref("");
const searchOrderNumber = ref("");
const searchStatus = ref("");
const token = JSON.parse(localStorage.getItem("user"))?.token;

const statusOptions = [
  "입금대기",
  "주문완료",
  "상품준비중",
  "배송중",
  "배송완료",
  "구매확정",
  "취소됨",
  "반품됨",
];

const fetchOrders = () => {
  const params = {
    name: searchName.value,
    orderNumber: searchOrderNumber.value,
    status: searchStatus.value,
  };
  AdminService.getAdminOrders(params, token)
    .then((res) => {
      orders.value = res.data;
    })
    .catch((err) => {
      console.error("❌ 주문 목록 조회 실패:", err);
      alert("주문 데이터를 불러오지 못했습니다.");
    });
};

const updateStatus = (order) => {
  AdminService.updateOrderStatus(order._id, order.status, token)
    .then(() => {
      alert("✅ 상태가 변경되었습니다.");
      fetchOrders();
    })
    .catch((err) => {
      console.error("❌ 상태 변경 실패:", err);
      alert("상태 변경 중 오류가 발생했습니다.");
    });
};

const format = (val) => (!val ? "0" : val.toLocaleString());
const formatDate = (date) => new Date(date).toLocaleDateString();

onMounted(() => fetchOrders());
</script>

<style scoped>
.adminOrderStatus {
  padding: 24px;
}
.filterBar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.orderTable {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.orderTable th,
.orderTable td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.orderTable th {
  background-color: #f5f5f5;
}
</style>
