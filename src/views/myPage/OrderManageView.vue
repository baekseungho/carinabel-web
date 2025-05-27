<template>
    <div class="orderViewContainer">
        <h2 class="pageTitle">📦 주문관리</h2>

        <!-- 🧭 탭 메뉴 -->
        <div class="tabs">
            <button :class="{ active: activeTab === 'default' }" @click="activeTab = 'default'">주문검색</button>
            <button :class="{ active: activeTab === 'referred' }" @click="activeTab = 'referred'">
                추천하위주문검색
            </button>
        </div>

        <!-- 📋 주문 테이블 -->
        <div class="orderTableWrapper">
            <table>
                <thead>
                    <tr>
                        <th>회원 ID</th>
                        <th>회원명</th>
                        <th v-if="activeTab === 'referred'">추천인</th>
                        <th>주문일자</th>
                        <th>수량</th>
                        <th>금액</th>
                        <th>주문상태</th>
                        <th>배송일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in filteredOrders" :key="order._id">
                        <td>{{ order.userId.email }}</td>
                        <td>{{ order.userId.fullName }}</td>
                        <td v-if="activeTab === 'referred'">{{ order.userId.referrer?.email || "-" }}</td>
                        <td>{{ formatDate(order.createdAt) }}</td>
                        <td>{{ order.quantity }}</td>
                        <td>{{ formatPrice(order.amount) }}원</td>
                        <td>{{ order.status }}</td>
                        <td>{{ formatDate(order.deliveryDate) }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="4">총 합계</th>
                        <th>{{ totalQuantity }}개</th>
                        <th>{{ formatPrice(totalAmount) }}원</th>
                        <th colspan="2"></th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
const activeTab = ref("default");
const orders = ref([]);
const token = JSON.parse(localStorage.getItem("user"))?.token;
const user = JSON.parse(localStorage.getItem("user"));
import OrderService from "@/api/OrderService";
// 📦 주문 불러오기
const loadOrders = () => {
    if (activeTab.value === "default") {
        OrderService.getOrders(user._id, token).then((res) => (orders.value = res.data));
    } else {
        OrderService.getReferredOrders(user._id, token).then((res) => (orders.value = res.data));
    }
};

// 📦 필터링된 리스트
const filteredOrders = computed(() => orders.value);

// 📊 합계 계산
const totalQuantity = computed(() => orders.value.reduce((sum, o) => sum + (o.quantity || 0), 0));
const totalAmount = computed(() => orders.value.reduce((sum, o) => sum + (o.amount || 0), 0));

onMounted(loadOrders);
watch(activeTab, loadOrders);

const formatPrice = (n) => n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};
</script>

<style scoped>
.orderViewContainer {
    padding: 40px 20px;
    max-width: 1200px;
    margin: auto;
    background-color: #fff;

    border-radius: 16px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.pageTitle {
    font-size: 28px;
    margin-bottom: 20px;
    font-weight: bold;
    color: #444;
}

.tabs {
    display: flex;
    margin-bottom: 20px;
}

.tabs button {
    padding: 10px 20px;
    border: none;
    background: #eee;
    font-weight: bold;
    cursor: pointer;
    border-radius: 8px 8px 0 0;
    margin-right: 8px;
    transition: background-color 0.2s;
}

.tabs button.active {
    background: #cc8a94;
    color: white;
}

.orderTableWrapper {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 12px;
    overflow: hidden;
}

th,
td {
    padding: 14px;
    text-align: center;
    border-bottom: 1px solid #eee;
}

tfoot {
    background: #f9f9f9;
    font-weight: bold;
}
</style>
