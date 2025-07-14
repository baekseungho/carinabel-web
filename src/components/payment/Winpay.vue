<template>
    <div class="buyProductButton" @click="startCardPayment">카드결제</div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import AuthService from "@/api/AuthService";
import OrderService from "@/api/OrderService";

const props = defineProps({
    product: Object,
    quantity: {
        type: Number,
        default: 1,
    },
    userInfo: Object,
    disabled: Boolean,
});

const router = useRouter();
const store = useStore();

// const payUrl = "https://apitest.kiwoompay.co.kr/pay/link"; // 개발
const payUrl = " https://api.kiwoompay.co.kr/pay/link"; // 운영
const server = "LIVE";
const cpid = "CWP11504";
const tmnid = "WGP329355";

const totalAmount = computed(() => {
    return (props.product.memberPrice || 0) * props.quantity;
});

const orderNo = `${cpid}_${new Date().getTime()}`;

// 로그인한 사용자 정보
const userId = props.userInfo?._id || "guest";
const userName = props.userInfo?.name || "비회원";
const email = props.userInfo?.email || "guest@example.com";
const token = props.userInfo?.token;

const startCardPayment = async () => {
    if (!userId || !token) {
        alert("로그인이 필요합니다.");
        return;
    }

    try {
        // ✅ 1. 주문 생성만 먼저 진행 (status: 결제대기)
        const orderRes = await OrderService.createOrder(
            {
                userId,
                productName: props.product.koreanName,
                amount: totalAmount.value,
                quantity: props.quantity,
                imagePath: props.product.imagePath,
                status: "입금대기",
            },
            token
        );

        const orderId = orderRes.data._id;
        const orderNumber = orderRes.data.orderNumber; // 결제창 식별용

        // ✅ 2. 결제 완료 후 이동할 페이지
        const homeUrl = `${window.location.origin}/order-complete/${orderId}`;
        const failUrl = `${window.location.origin}/payment/fail`;

        // ✅ 3. 결제창 호출 파라미터 준비
        const params = {
            SERVER: server,
            TYPE: "P",
            PAYMETHOD: "CARD",
            CPID: cpid,
            RESERVEDSTRING: tmnid,
            ORDERNO: orderNumber,
            PRODUCTTYPE: "2",
            TAXFREECD: "00",
            BILLTYPE: "1",
            // AMOUNT: totalAmount.value.toString(),
            AMOUNT: 100,

            PRODUCTNAME: props.product.koreanName,
            PRODUCTCODE: props.product._id,
            USERID: userId,
            USERNAME: userName,
            EMAIL: email,
            // HOMEURL: homeUrl,
            FAILURL: failUrl,
        };

        // ✅ 4. 결제창 팝업 띄우기
        const paymentWindow = window.open("", "KIWOOMPAY", "width=468,height=750");

        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", payUrl);
        form.setAttribute("target", "KIWOOMPAY");
        form.setAttribute("accept-charset", "euc-kr");

        for (const key in params) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = params[key];
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        // ✅ 5. 결제창 닫힘 감지 후 상태 업데이트 + 누적금액 업데이트
        const checkInterval = setInterval(async () => {
            if (paymentWindow.closed) {
                clearInterval(checkInterval);

                try {
                    // ✅ 윈페이 토큰 받아오기
                    const tokenRes = await OrderService.getWinpayJwtToken();
                    const winpayJwtToken = tokenRes.data.token;

                    // ✅ 올바른 토큰을 사용하여 결제 결과 확인
                    const res = await OrderService.getPaymentStatus(orderNumber, winpayJwtToken);
                    const result = res.data;

                    if (result.success && result.message === "결제 성공") {
                        // 결제 성공
                        await OrderService.updateOrderStatus(orderId, "결제완료", token);
                        await AuthService.updateUserProfile(userId, totalAmount.value, token);
                        router.push(`/order-complete/${orderId}`);
                    } else {
                        alert("❌ 결제가 정상적으로 처리되지 않았습니다.");
                        console.warn("윈페이 응답:", result);
                    }
                } catch (err) {
                    console.error("❌ 결제 확인 API 실패:", err);
                    alert("결제 결과 확인에 실패했습니다.");
                }
            }
        }, 1000);
    } catch (error) {
        console.error("❌ 결제 준비 실패:", error);
        const message = error.response?.data?.message || "결제 준비에 실패했습니다.";
        alert(message);
    }
};

onMounted(async () => {
    const tokenRes = await OrderService.getWinpayJwtToken();
    const winpayJwtToken = tokenRes.data.token;
    console.log(winpayJwtToken);
    const res = await OrderService.getPaymentStatus("0000000089", winpayJwtToken);
    const result = res.data;
    console.log(result);
});
</script>

<style scoped>
.buyProductButton {
    background-color: #cc8a94;
    color: #fff;
    padding: 15px 30px;
    font-size: 1.2rem;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
    text-align: center;
    align-self: flex-start;
    /* margin-right: 12px; */
}
.buyProductButton button {
    width: 100%;
    height: 100%;
}
.buyProductButton:first-child {
    width: 49%;
}
.buyProductButton:last-child {
    width: 49%;
}
.buyProductButton:hover {
    background-color: #c97582;
}

.buyProductButton:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
    opacity: 0.7;
    pointer-events: none;
}

.payBtn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.payBtn .icon {
    font-size: 18px;
}
</style>
