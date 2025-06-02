<template>
    <div class="orderHistoryPage">
        <h2 class="pageTitle">주문 내역</h2>

        <!-- 상태 필터 영역 -->
        <div class="statusFilters">
            <button
                v-for="s in statusList"
                :key="s.value"
                :class="['filterBtn', { active: selectedStatus === s.value }]"
                @click="changeStatus(s.value)"
            >
                {{ s.label }}
                <!-- ({{ countByStatus(s.value) }}) -->
            </button>
        </div>

        <!-- 주문 리스트 -->
        <div class="orderList">
            <div
                v-for="order in filteredOrders"
                :key="order._id"
                class="orderCard"
            >
                <div class="orderHeader">
                    <span class="orderDate">{{
                        formatDate(order.createdAt)
                    }}</span>
                    <span class="orderStatus">{{
                        statusLabel(order.status)
                    }}</span>
                </div>

                <div class="orderBody">
                    <div class="productInfo">
                        <img
                            :src="order.imagePath || '/img/default.jpg'"
                            alt="상품 이미지"
                            class="productImage"
                        />
                        <div class="productDetails">
                            <div class="productName">
                                {{ order.productName }}
                            </div>
                            <div class="productPrice">
                                {{ formatPrice(order.amount) }}원
                            </div>
                        </div>
                    </div>
                    <button class="detailBtn" @click="goToDetail(order)">
                        조회 하기
                    </button>
                </div>
            </div>
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
import { ref, onMounted, computed } from "vue";
import OrderService from "@/api/OrderService";
import { useRoute, useRouter } from "vue-router";
import Pagination from "@/components/common/Pagination.vue";
const router = useRouter();
const orders = ref([]);
const selectedStatus = ref("all");
const currentPage = ref(1);
const pageSize = 5;
const totalPages = ref(1);

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const statusList = [
    { value: "all", label: "전체" },
    { value: "미결제", label: "주문완료/입금대기" },
    { value: "결제완료", label: "입금완료/배송준비" },
    { value: "배송중", label: "배송중" },
    { value: "배송완료", label: "배송완료" },
    { value: "취소됨", label: "취소" },
];

const fetchOrders = () => {
    const query = {
        userId: user._id,
        status: selectedStatus.value,
        page: currentPage.value,
        size: pageSize,
    };

    OrderService.getOrdersWithPaging(query, token).then((res) => {
        orders.value = res.data.orders;
        totalPages.value = Math.ceil(res.data.total / pageSize);
        console.log(totalPages.value);
    });
};

const filteredOrders = computed(() => {
    if (selectedStatus.value === "all") return orders.value;
    return orders.value.filter((o) => o.status === selectedStatus.value);
});

const statusLabel = (status) => {
    const map = {
        미결제: "주문완료/입금대기",
        결제완료: "입금완료/배송준비",
        배송중: "배송중",
        배송완료: "배송완료",
        취소됨: "취소",
    };
    return map[status] || "-";
};

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
        .getHours()
        .toString()
        .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

const formatPrice = (p) => p.toLocaleString();

const countByStatus = (status) => {
    if (status === "all") return orders.value.length;
    return orders.value.filter((o) => o.status === status).length;
};

function goToDetail(order) {
    console.log(order);
    router.push({ name: "OrderHistoryDetailView", params: { id: order._id } });
}

const changeStatus = (status) => {
    selectedStatus.value = status;
    currentPage.value = 1;
    fetchOrders();
};

const handlePageChange = (page) => {
    currentPage.value = page;
    fetchOrders();
};

onMounted(fetchOrders);
</script>

<style scoped>
.orderHistoryPage {
    animation: fadeIn 0.5s ease;
    padding: 40px 20px;
}
.pageTitle {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 24px;
}
.statusFilters {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}
.filterBtn {
    padding: 8px 14px;
    border-radius: 8px;
    background-color: #eee;
    border: none;
    cursor: pointer;
}
.filterBtn.active {
    background-color: #cc8a94;
    color: white;
}
.orderList {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.orderCard {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.orderHeader {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #777;
    margin-bottom: 10px;
}
.orderBody {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.productInfo {
    display: flex;
    align-items: center;
    gap: 12px;
}
.productImage {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid #ccc;
}
.productDetails {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.productName {
    font-weight: bold;
}
.productPrice {
    color: #cc8a94;
}
.detailBtn {
    background: #857496;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
}
.detailBtn:hover {
    background: #6f617e;
}
</style>
