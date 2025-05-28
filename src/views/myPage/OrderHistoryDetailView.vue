<template>
    <div class="orderDetailPage">
        <h2 class="pageTitle">주문 내역 상세 보기</h2>

        <div class="orderSummary">
            <div class="productInfo">
                <img
                    :src="order.product?.imagePath || '/img/default.jpg'"
                    alt="상품 이미지"
                    class="productImg"
                />
                <div class="productText">
                    <h3>{{ order.product?.productName }}</h3>
                    <p>수량: {{ order.product?.quantity }}개</p>
                    <p>가격: {{ formatPrice(order.product?.amount) }}원</p>
                    <p>상태: {{ statusLabel(order.status) }}</p>
                </div>
            </div>
            <div class="actionButtons">
                <button class="themaBgColor3">구매확정</button>
                <button class="themaBgColor4">문의하기</button>
                <button class="themaBgColor5">상품평쓰기</button>
            </div>
        </div>

        <div class="section">
            <h4>주문자 정보</h4>
            <ul class="infoList">
                <li>
                    <strong>이름</strong><span>{{ order.user?.fullName }}</span>
                </li>
                <li>
                    <strong>이메일</strong><span>{{ order.user?.email }}</span>
                </li>
                <li>
                    <strong>전화번호</strong
                    ><span>{{ order.user?.phone || "-" }}</span>
                </li>
            </ul>
        </div>

        <div class="section">
            <h4>배송지 정보</h4>
            <ul class="infoList">
                <li>
                    <strong>받는 사람</strong
                    ><span>{{ order.delivery?.recipientName }}</span>
                </li>
                <li>
                    <strong>연락처</strong
                    ><span>{{ order.delivery?.phone }}</span>
                </li>
                <li>
                    <strong>주소</strong
                    ><span>{{ order.delivery?.fullAddress }}</span>
                </li>
            </ul>
        </div>

        <div class="section">
            <h4>결제 정보</h4>
            <ul class="infoList">
                <li>
                    <strong>결제 수단</strong
                    ><span>{{ order.payment?.method }}</span>
                </li>
                <li>
                    <strong>결제 상태</strong
                    ><span>{{ order.payment?.status }}</span>
                </li>
                <li>
                    <strong>은행명</strong
                    ><span>{{ order.payment?.bank }}</span>
                </li>
                <li>
                    <strong>가상계좌</strong
                    ><span>{{ order.payment?.virtualAccount }}</span>
                </li>
                <li>
                    <strong>입금기한</strong
                    ><span>{{ formatDateTime(order.payment?.dueDate) }}</span>
                </li>
                <li>
                    <strong>상품금액</strong
                    ><span>{{ formatPrice(order.product?.amount) }}원</span>
                </li>
                <li><strong>배송비</strong><span>0원</span></li>
                <li>
                    <strong>총 결제금액</strong
                    ><span>{{ formatPrice(order.product?.amount) }}원</span>
                </li>
            </ul>
        </div>

        <div class="footerButtons">
            <button class="confirmBtn" @click="goBack">확인</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import OrderService from "@/api/OrderService";

const route = useRoute();
const router = useRouter();
const token = localStorage.getItem("token");
const orderId = route.params.id;
const order = ref({});

const fetchOrderDetail = () => {
    OrderService.getOrderDetail(orderId, token)
        .then((res) => {
            order.value = res.data;
        })
        .catch((err) => {
            console.error("❌ 주문 상세 조회 실패:", err);
        });
};

const formatPrice = (price) => (price ? price.toLocaleString() : "0");
const goBack = () => router.push("/mypage/order-history");

const formatDateTime = (str) => {
    if (!str) return "-";
    const d = new Date(str);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
        .getHours()
        .toString()
        .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

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

onMounted(fetchOrderDetail);
</script>

<style scoped>
.orderDetailPage {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.pageTitle {
    font-size: 24px;
    margin-bottom: 24px;
}
.orderSummary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 20px;
}
.productInfo {
    display: flex;
    align-items: center;
    gap: 20px;
}
.productImg {
    width: 100px;
    height: 100px;
    object-fit: contain;
    border: 1px solid #ccc;
    border-radius: 8px;
}
.productText h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
}
.actionButtons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.actionButtons button {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: white;
}
.section {
    margin-bottom: 24px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 12px;
}
.section h4 {
    margin-bottom: 16px;
    font-size: 18px;
    color: #444;
    font-weight: bold;
    border-bottom: 2px solid #ccc;
    padding-bottom: 6px;
}
.infoList {
    list-style: none;
    padding: 0;
    margin: 0;
}
.infoList li {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    font-size: 15px;
    line-height: 1.6;
    gap: 12px;
}
.infoList li strong {
    color: #555;
    width: 40%;
    flex-shrink: 0;
}
.infoList li span {
    text-align: right;
    width: 58%;
    color: #333;
    word-break: break-word;
}
.footerButtons {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
.confirmBtn {
    padding: 10px 16px;
    background-color: #604b6e;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}
</style>
