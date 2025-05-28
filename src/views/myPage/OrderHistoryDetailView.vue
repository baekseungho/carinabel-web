<template>
    <div class="orderDetailPage">
        <!-- 주문 요약 -->
        <div class="summaryBox">
            <h2>주문 내역 상세 보기</h2>
            <p class="orderId">
                주문번호: <strong>{{ order?._id || "---" }}</strong>
            </p>
        </div>

        <!-- 구매자 상품 정보 -->
        <div class="productInfoBox">
            <h3>구매자 상품보기</h3>
            <div class="productInfo">
                <img :src="order?.product?.detailImage || '/img/default.jpg'" class="productImage" />
                <div class="productDetails">
                    <p class="productName">{{ order?.product?.koreanName }}</p>
                    <p>
                        상품금액: <strong>{{ formatPrice(order?.amount) }}원</strong>
                    </p>
                    <p>수량: {{ order?.quantity }}개</p>
                    <p>
                        합계: <strong>{{ formatPrice(order?.amount * order?.quantity) }}원</strong>
                    </p>
                    <p class="status">상태: {{ statusLabel(order?.status) }}</p>
                    <div class="actionBtns">
                        <button class="actionBtn themaBgColor4">배송조회</button>
                        <button class="actionBtn themaBgColor3">문의하기</button>
                        <button class="actionBtn themaBgColor5">상품평쓰기</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 주문자/배송지/결제 정보 -->
        <div class="infoTables">
            <div class="infoSection">
                <h4>주문자 정보</h4>
                <table>
                    <tr>
                        <th>이름</th>
                        <td>{{ order?.user?.fullName }}</td>
                    </tr>
                    <tr>
                        <th>전화번호</th>
                        <td>{{ order?.user?.phone || "-" }}</td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td>{{ order?.user?.email }}</td>
                    </tr>
                </table>
            </div>

            <div class="infoSection">
                <h4>배송지 정보</h4>
                <table>
                    <tr>
                        <th>받는사람</th>
                        <td>{{ order?.address?.recipientName }}</td>
                    </tr>
                    <tr>
                        <th>전화번호</th>
                        <td>{{ order?.address?.phone || "-" }}</td>
                    </tr>
                    <tr>
                        <th>휴대폰</th>
                        <td>{{ order?.address?.mobile }}</td>
                    </tr>
                    <tr>
                        <th>주소</th>
                        <td>{{ order?.address?.address }}</td>
                    </tr>
                </table>
            </div>

            <div class="infoSection">
                <h4>결제 정보</h4>
                <table>
                    <tr>
                        <th>결제방법</th>
                        <td>가상계좌</td>
                    </tr>
                    <tr>
                        <th>결제상태</th>
                        <td>{{ statusLabel(order?.status) }}</td>
                    </tr>
                    <tr>
                        <th>가상계좌</th>
                        <td>
                            {{ order?.user?.fullName }} / {{ order?.user?.bankName }} / {{ order?.user?.accountNumber }}
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- 총 결제 금액 -->
        <div class="paymentSummary">
            <p>
                상품금액: {{ formatPrice(order?.amount) }}원 + 배송비: 0원 =
                <strong>{{ formatPrice(order?.amount) }}원</strong>
            </p>
            <div class="bottomBtns">
                <button class="confirmBtn">확인</button>
                <button class="printBtn">인쇄</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "@/api/axios";

const route = useRoute();
const order = ref(null);
const token = localStorage.getItem("token");

onMounted(() => {
    axios
        .get(`/orders/detail/${route.params.orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            order.value = res.data;
        });
});

const formatPrice = (val) => (val || 0).toLocaleString();

const statusLabel = (s) => {
    const map = {
        미결제: "주문완료/입금대기",
        결제완료: "입금완료/배송준비",
        배송중: "배송중",
        배송완료: "배송완료",
        취소됨: "취소됨",
    };
    return map[s] || s;
};
</script>

<style scoped>
.orderDetailPage {
    padding: 30px;
    max-width: 900px;
    margin: auto;
    font-family: "Noto Sans KR", sans-serif;
}
.summaryBox {
    margin-bottom: 24px;
}
.orderId {
    margin-top: 10px;
    font-size: 15px;
    color: #555;
}
.productInfoBox {
    background: #fdfdfd;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 30px;
}
.productInfo {
    display: flex;
    gap: 20px;
}
.productImage {
    width: 100px;
    height: 100px;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid #eee;
}
.productDetails {
    flex: 1;
}
.status {
    margin-top: 10px;
    font-weight: bold;
}
.actionBtns {
    display: flex;
    gap: 10px;
    margin-top: 12px;
}
.actionBtn {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 14px;
    color: #fff;
    border: none;
    cursor: pointer;
}
.infoTables {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 30px;
}
.infoSection {
    flex: 1 1 280px;
    background: #fafafa;
    padding: 16px;
    border-radius: 10px;
    border: 1px solid #ddd;
}
.infoSection h4 {
    margin-bottom: 10px;
}
.infoSection table {
    width: 100%;
    font-size: 14px;
}
.infoSection table th {
    text-align: left;
    width: 100px;
    color: #666;
    padding-bottom: 6px;
}
.paymentSummary {
    text-align: right;
    font-size: 16px;
}
.bottomBtns {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}
.confirmBtn,
.printBtn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    border: none;
    cursor: pointer;
}
.confirmBtn {
    background-color: #cc8a94;
    color: white;
}
.printBtn {
    background-color: #999;
    color: white;
}
</style>
