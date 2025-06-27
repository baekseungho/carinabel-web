<template>
    <div>
        <button class="buyProductButton" @click="initiatePayment" :disabled="disabled">결제하기</button>
    </div>
</template>

<script setup>
import { ref } from "vue";
import PayService from "@/api/payService";

const props = defineProps({
    productName: String,
    amount: Number,
    quantity: Number,
    userInfo: Object, // { userId, fullName, email }
    disabled: Boolean,
});

const SERVER_URL = "http://localhost:5000"; // ✅ 실제 서버 주소로 변경
const jwtToken = localStorage.getItem("token");

function generateTid() {
    const now = new Date();
    const yyyyMMddHHmmss = now
        .toISOString()
        .replace(/[-T:\.Z]/g, "")
        .substring(0, 14);
    const rand = Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0");
    return `ORDER_${yyyyMMddHHmmss}${rand}`;
}

const initiatePayment = () => {
    const tid = generateTid();

    const requestData = {
        tid,
        amt: props.amount,
        goodsName: props.productName,
        productType: "2",
        payMethod: "MOBILE",
        ordNm: props.userInfo.fullName || "비회원",
        email: props.userInfo.email || "test@example.com",
        returnUrl: `${SERVER_URL}/payment/result`,
    };

    PayService.requestPayment(requestData, jwtToken)
        .then((res) => {
            const data = res.data;
            if (data.success) {
                const width = 700;
                const height = 1000;
                const left = (window.screen.width - width) / 2;
                const top = (window.screen.height - height) / 2;

                const popup = window.open(
                    data.paymentUrl,
                    "KiwoomPayment",
                    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
                );

                const check = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(check);
                        checkPaymentResult(tid);
                    }
                }, 1000);
            } else {
                alert(`결제 실패: ${data.message}`);
            }
        })
        .catch((err) => {
            console.error("❌ 결제 오류:", err);
            alert("결제 요청 중 오류가 발생했습니다.");
        });
};

const checkPaymentResult = (tid) => {
    PayService.checkPaymentResult(tid, jwtToken)
        .then((res) => {
            const data = res.data;
            if (data.success) {
                alert("결제가 성공적으로 완료되었습니다.");
                // ✅ 후처리 (주문 저장, 페이지 이동 등)
            } else {
                alert(`결제 실패: ${data.message}`);
            }
        })
        .catch((err) => {
            console.error("❌ 결제 결과 확인 실패:", err);
            alert("결제 결과 확인 중 오류가 발생했습니다.");
        });
};
</script>
