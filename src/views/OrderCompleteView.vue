<template>
    <div class="orderCompleteContainer" v-if="order">
        <div class="productPreview">
            <img
                :src="order.product.imagePath"
                :alt="order.product.productName"
            />
        </div>

        <div class="completeMessage">
            <h1>결제가 완료되었습니다</h1>
            <p>주문이 정상적으로 완료되었습니다. 감사합니다!</p>
        </div>

        <div class="orderCard">
            <h2>주문 정보</h2>
            <ul>
                <li><strong>주문번호:</strong> {{ order.orderNumber }}</li>
                <li>
                    <strong>주문일시:</strong> {{ formatDate(order.createdAt) }}
                </li>
                <li>
                    <strong>상품명:</strong> {{ order.product.productName }}
                </li>
                <li><strong>수량:</strong> {{ order.product.quantity }}개</li>
                <li>
                    <strong>결제금액:</strong>
                    {{ formatPrice(order.product.amount) }}원
                </li>
                <li><strong>결제수단:</strong> {{ order.payment.method }}</li>
                <li><strong>결제상태:</strong> {{ order.status }}</li>
            </ul>
        </div>

        <div class="orderCard">
            <h2>배송지 정보</h2>
            <ul>
                <li>
                    <strong>수령인:</strong> {{ order.delivery.recipientName }}
                </li>
                <li><strong>연락처:</strong> {{ order.user.phone }}</li>
                <li><strong>우편번호:</strong> {{ order.delivery.zipCode }}</li>
                <li>
                    <strong>주소:</strong> {{ order.delivery.address }}
                    {{ order.delivery.detailAddress }}
                </li>
                <li><strong>배송 메모:</strong> {{ order.delivery.memo }}</li>
            </ul>
        </div>

        <button class="homeBtn" @click="goHome">홈으로 이동</button>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import OrderService from "@/api/OrderService";
import AuthService from "@/api/AuthService";
import { useStore } from "vuex";

const order = ref(null);
const route = useRoute();
const router = useRouter();
const store = useStore();
const orderId = route.params.id;

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatPrice = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const goHome = () => {
    router.push("/");
};

onMounted(async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!orderId || !token || !user) {
        alert("잘못된 접근입니다.");
        router.push("/");
        return;
    }

    try {
        // ✅ 1. 주문 상세 가져오기
        const res = await OrderService.getOrderDetail(orderId, token);
        order.value = res.data;

        // ✅ 2. 상태가 입금대기인 경우 → 결제완료 처리
        if (order.value.status === "입금대기") {
            // 주문 상태 서버 업데이트
            await OrderService.updateOrderStatus(orderId, "결제완료", token);

            // 프론트 상태도 직접 반영
            order.value.status = "결제완료";

            // 누적 금액 업데이트
            await AuthService.updateUserProfile(
                user._id,
                order.value.product.amount,
                token
            );
            localStorage.setItem("paidOrder", orderId);
        }
    } catch (err) {
        console.error("❌ 주문 처리 실패:", err);
        alert("주문 정보를 처리할 수 없습니다.");
        router.push("/");
    }
});
</script>

<style scoped>
.orderCompleteContainer {
    max-width: 700px;
    margin: 60px auto;
    padding: 24px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    text-align: center;
    animation: fadeIn 0.4s ease;
}

.productPreview img {
    width: 100%;
    max-height: 280px;
    object-fit: contain;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
}

.completeMessage h1 {
    color: #3aa14d;
    font-size: 28px;
    margin-bottom: 8px;
}
.completeMessage p {
    font-size: 16px;
    color: #777;
    margin-bottom: 24px;
}

.orderCard {
    text-align: left;
    margin: 20px 0;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

.orderCard h2 {
    font-size: 20px;
    margin-bottom: 12px;
    color: #333;
}

.orderCard ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.orderCard li {
    margin-bottom: 10px;
    font-size: 15px;
    color: #444;
}

.orderCard li strong {
    display: inline-block;
    width: 110px;
    color: #555;
}

.homeBtn {
    margin-top: 32px;
    padding: 12px 28px;
    background-color: #3aa14d;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
}
.homeBtn:hover {
    background-color: #2e8d3b;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
