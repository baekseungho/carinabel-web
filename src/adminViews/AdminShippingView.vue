<template>
    <div class="adminOrderStatus">
        <h1 class="pageTitle">배송 상태 관리</h1>

        <div class="filterBar">
            <input v-model="searchName" placeholder="회원명 검색" />
            <input v-model="searchOrderNumber" placeholder="주문번호 검색" />
            <select v-model="searchStatus">
                <option value="">전체 상태</option>
                <option v-for="s in statusOptions" :key="s" :value="s">
                    {{ s }}
                </option>
            </select>
            <button @click="fetchOrders">검색</button>
        </div>

        <table class="orderTable">
            <thead>
                <tr>
                    <th>
                        <input type="checkbox" v-model="selectAll" @change="toggleAll" />
                    </th>
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
                    <td>
                        <input type="checkbox" v-model="selectedOrders" :value="order._id" />
                    </td>
                    <td>{{ order.orderNumber }}</td>
                    <td>{{ order.userId.fullName }}</td>
                    <td>{{ order.productName }}</td>
                    <td>{{ order.quantity }}</td>
                    <td>{{ format(order.amount) }}원</td>
                    <td>{{ formatDate(order.createdAt) }}</td>
                    <td>{{ order.status }}</td>
                    <td>
                        <select v-model="pendingStatuses[order._id]">
                            <option v-for="s in statusOptions" :key="s" :value="s">
                                {{ s }}
                            </option>
                        </select>
                        <button @click="updateStatus(order)">변경</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- 선택한 주문 상태 일괄 변경 -->
        <div class="toggleStateBox" style="margin-top: 1rem">
            <select v-model="bulkStatus">
                <option disabled value="">상태 선택</option>
                <option v-for="s in statusOptions" :key="s" :value="s">
                    {{ s }}
                </option>
            </select>
            <button @click="updateMultipleStatus">선택 항목 상태 일괄 변경</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminService from "@/api/AdminService";

const orders = ref([]);
const searchName = ref("");
const searchOrderNumber = ref("");
const searchStatus = ref("입금대기");
const token = JSON.parse(localStorage.getItem("user"))?.token;
const selectedOrders = ref([]); // 선택된 주문 ID 배열
const selectAll = ref(false); // 전체선택 체크박스
const pendingStatuses = ref({}); // 주문별 상태 임시 저장용
const bulkStatus = ref(""); // 일괄 변경할 상태

const toggleAll = () => {
    if (selectAll.value) {
        selectedOrders.value = orders.value.map((order) => order._id);
    } else {
        selectedOrders.value = [];
    }
};

const statusOptions = ["입금대기", "결제완료", "상품준비중", "배송중", "배송완료", "구매확정", "취소됨", "반품됨"];

const fetchOrders = () => {
    const params = {
        name: searchName.value,
        orderNumber: searchOrderNumber.value,
        status: searchStatus.value,
    };
    AdminService.getAdminOrders(params, token)
        .then((res) => {
            orders.value = res.data;

            // ✅ 각 주문의 status를 pendingStatuses 초기값으로 설정
            pendingStatuses.value = {};
            for (const order of res.data) {
                pendingStatuses.value[order._id] = order.status;
            }
        })
        .catch((err) => {
            console.error("❌ 주문 목록 조회 실패:", err);
            alert("주문 데이터를 불러오지 못했습니다.");
        });
};

const updateStatus = (order) => {
    const selectedStatus = pendingStatuses.value[order._id];
    if (!selectedStatus || selectedStatus === order.status) {
        alert("상태가 변경되지 않았습니다.");
        return;
    }

    AdminService.updateOrderStatus(order._id, selectedStatus, token)
        .then(() => {
            alert("✅ 상태가 변경되었습니다.");
            fetchOrders(); // 다시 불러와서 UI 싱크 맞춤
        })
        .catch((err) => {
            console.error("❌ 상태 변경 실패:", err);
            alert("상태 변경 중 오류가 발생했습니다.");
        });
};

const updateMultipleStatus = () => {
    if (selectedOrders.value.length === 0) {
        return alert("선택된 주문이 없습니다.");
    }
    if (!bulkStatus.value) {
        return alert("변경할 상태를 선택해주세요.");
    }

    const updates = selectedOrders.value.map((id) => AdminService.updateOrderStatus(id, bulkStatus.value, token));

    Promise.all(updates)
        .then(() => {
            alert("✅ 선택된 주문들의 상태가 변경되었습니다.");
            fetchOrders();
            selectedOrders.value = [];
            selectAll.value = false;
        })
        .catch((err) => {
            console.error("❌ 일괄 상태 변경 실패:", err);
            alert("일괄 상태 변경 중 오류가 발생했습니다.");
        });
};

const format = (val) => (!val ? "0" : val.toLocaleString());
const formatDate = (date) => new Date(date).toLocaleDateString();

onMounted(() => fetchOrders());
</script>

<style scoped>
.adminOrderStatus {
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
    padding: 0 20px;
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
    padding: 0.4rem 1rem;
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
.orderTable select {
    padding: 8px 12px;
    border: 1px solid #999;
    border-radius: 6px;
    font-size: 0.95rem;
    background-color: white;
    height: 40px;
    vertical-align: middle;
    /* appearance: none; ❌ 제거 */
    cursor: pointer;
    margin-right: 4px;
}
.orderTable select:focus {
    outline: none;
    border-color: #cc8a94;
    box-shadow: 0 0 4px rgba(204, 138, 148, 0.5);
}
.orderTable button {
    vertical-align: middle;
    height: 40px;
}

.toggleStateBox {
    display: flex;
    align-items: center;
}
.toggleStateBox select {
    padding: 8px 12px;
    border: 1px solid #999;
    border-radius: 6px;
    font-size: 0.95rem;
    background-color: white;
    height: 40px;
    vertical-align: middle;
    /* appearance: none; ❌ 제거 */
    cursor: pointer;
    margin-right: 4px;
}
.toggleStateBox select:focus {
    outline: none;
    border-color: #cc8a94;
    box-shadow: 0 0 4px rgba(204, 138, 148, 0.5);
}

.toggleStateBox button {
    height: 40px;
}
</style>
