<template>
    <div class="adminCancelPage">
        <h1>🛑 취소대기 주문관리</h1>

        <div v-if="orders.length === 0">취소대기 중인 주문이 없습니다.</div>

        <table v-else class="cancelTable">
            <thead>
                <tr>
                    <th>주문번호</th>
                    <th>상품명</th>
                    <th>금액</th>
                    <th>사유</th>
                    <th>TRXID</th>
                    <th>작업</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order._id">
                    <td>{{ order.orderNumber }}</td>
                    <td>{{ order.productName }}</td>
                    <td>{{ formatPrice(order.amount) }}원</td>
                    <td>{{ order.reason }}</td>
                    <td>
                        <input v-model="trxIds[order._id]" placeholder="TRXID 입력" />
                    </td>
                    <td>
                        <button @click="cancelOrder(order._id)">취소처리</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminService from "@/api/AdminService";
import { useStore } from "vuex";

const store = useStore();
const token = localStorage.getItem("token");

const orders = ref([]);
const trxIds = ref({});

const formatPrice = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// 📦 취소대기 주문 불러오기
const fetchOrders = async () => {
    try {
        const res = await AdminService.getPendingCancelOrders(token);
        orders.value = res.data;
    } catch (err) {
        console.error("❌ 주문 목록 불러오기 실패:", err);
        alert("주문 목록을 불러오지 못했습니다.");
    }
};

// 🔁 실제 취소 처리
const cancelOrder = async (orderId) => {
    const trxId = trxIds.value[orderId];
    if (!trxId) {
        alert("TRXID를 입력해주세요.");
        return;
    }

    const confirm = window.confirm("정말로 이 주문을 취소하시겠습니까?");
    if (!confirm) return;

    try {
        const res = await AdminService.cancelOrderAsAdmin(orderId, trxId, token);
        alert("✅ 주문이 성공적으로 취소되었습니다.");
        await fetchOrders();
    } catch (err) {
        console.error("❌ 주문 취소 실패:", err);
        alert("주문 취소 처리에 실패했습니다.");
    }
};

onMounted(fetchOrders);
</script>

<style scoped>
.adminCancelPage {
    padding: 30px;
    padding-left: 200px;
}
.cancelTable {
    width: 100%;
    border-collapse: collapse;
}
.cancelTable th,
.cancelTable td {
    padding: 12px;
    border: 1px solid #ccc;
}
.cancelTable input {
    width: 120px;
}
button {
    border: 1px solid #ccc;
}
</style>
