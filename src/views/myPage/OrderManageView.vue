<template>
    <div class="orderViewContainer">
        <h2 class="pageTitle">주문관리</h2>

        <!-- 🧭 탭 메뉴 -->
        <div class="tabs">
            <button
                :class="{ active: activeTab === 'default' }"
                @click="activeTab = 'default'"
            >
                주문검색
            </button>
            <button
                :class="{ active: activeTab === 'referred' }"
                @click="activeTab = 'referred'"
            >
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
                        <th>상품명</th>
                        <th>금액</th>
                        <th>주문상태</th>
                        <th>배송일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in filteredOrders" :key="order._id">
                        <td>{{ order.userId.email }}</td>
                        <td>{{ order.userId.fullName }}</td>
                        <td v-if="activeTab === 'referred'">
                            {{ order.userId.referrerId?.fullName }} ({{
                                order.userId.referrerId?.email
                            }})
                        </td>
                        <td>{{ formatDate(order.createdAt) }}</td>
                        <td>{{ order.quantity }}</td>
                        <td>{{ order.productName }}</td>
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

        <Pagination
         v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import OrderService from "@/api/OrderService";
import Pagination from "@/components/common/Pagination.vue";
const activeTab = ref("default");
const orders = ref([]);
const token = JSON.parse(localStorage.getItem("user"))?.token;
const user = JSON.parse(localStorage.getItem("user"));

const selectedStatus = ref("all");
const currentPage = ref(1);
const pageSize = 10;
const totalPages = ref(1);

// 📦 주문 불러오기
const fetchOrders = () => {
    const query = {
        userId: user._id,
        status: selectedStatus.value,
        page: currentPage.value,
        size: pageSize,
    };
    const query2 = {
        referrerId: user._id,
        page: currentPage.value,
        size: pageSize,
    };

    if (activeTab.value === "default") {
        OrderService.getOrdersWithPaging(query, token).then((res) => {
            orders.value = res.data.orders;
            totalPages.value = Math.ceil(res.data.total / pageSize);
        });
    } else {
        OrderService.getReferredOrdersWithPaging(query2, token).then((res) => {
            orders.value = res.data.orders;
            totalPages.value = Math.ceil(res.data.total / pageSize);
        });
    }
};

// 📦 필터링된 리스트
const filteredOrders = computed(() => orders.value);

// 📊 합계 계산
const totalQuantity = computed(() =>
    orders.value.reduce((sum, o) => sum + (o.quantity || 0), 0)
);
const totalAmount = computed(() =>
    orders.value.reduce((sum, o) => sum + (o.amount || 0), 0)
);

onMounted(fetchOrders);
watch(activeTab, fetchOrders);

const formatPrice = (n) => n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
        .getHours()
        .toString()
        .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

const handlePageChange = (page) => {
    currentPage.value = page;
    fetchOrders();
};
</script>

<style scoped>
.orderViewContainer {
    padding: 20px 30px;
    margin: auto;
    background-color: #fff;
    border-radius: 16px;
    animation: fadeIn 0.5s ease;
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
    /* border-radius: 12px; */
    overflow: hidden;
}
thead {
    background-color: #333;
    color: #fff;
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
