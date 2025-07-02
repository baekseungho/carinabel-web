<template>
    <div>
        <button style="font-size: 8px" class="buyProductButton" @click="initiateBankPay" :disabled="disabled">
            결제TEST
        </button>
    </div>
</template>

<script setup>
import { ref } from "vue";
import PayService from "@/api/SimplePayService.js";
import { openBankPayWallet } from "@/utils/bankpayUtil"; // 팝업 띄우는 유틸 함수

const props = defineProps({
    productName: String,
    amount: Number,
    quantity: Number,
    userInfo: Object, // { userId, fullName, email }
    disabled: Boolean,
});

const SERVER_URL = window.location.origin;
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

const initiateBankPay = () => {
    const tid = generateTid();

    const requestData = {
        tid,
        amt: props.amount,
        goodsName: props.productName,
        productType: "00", // 실물
        payMethod: "BPAY",
        ordNm: props.userInfo.fullName || "비회원",
        email: props.userInfo.email || "test@example.com",
        returnUrl: `${SERVER_URL}/payment/bankpay/result`,
    };

    PayService.requestBankPay(requestData, jwtToken)
        .then((res) => {
            const data = res.data;
            if (data.success) {
                const urlData = JSON.parse(data.paymentUrl);
                openBankPayWallet(urlData, tid); // 뱅크페이 전용 팝업 실행
            } else {
                alert(`결제 실패: ${data.message}`);
            }
        })
        .catch((err) => {
            console.error("❌ 결제 오류:", err);
            alert("결제 요청 중 오류가 발생했습니다.");
        });
};

// ✅ 팝업 닫힘 후 결과 확인
function checkPaymentResult(tid) {
    PayService.checkPaymentResult(tid, jwtToken)
        .then((res) => {
            const data = res.data;
            if (data.success) {
                alert("결제가 성공적으로 완료되었습니다.");
                // ✅ 후처리 (예: 주문 저장, 이동 등)
            } else {
                alert(`결제 실패: ${data.message}`);
            }
        })
        .catch((err) => {
            console.error("❌ 결제 결과 확인 실패:", err);
            alert("결제 결과 확인 중 오류가 발생했습니다.");
        });
}
</script>
