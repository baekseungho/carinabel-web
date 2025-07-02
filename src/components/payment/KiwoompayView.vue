<template>
    <div class="kiwoomPayButtons">
        <button
            class="payBtn naver"
            @click="callPay('NAVERPAY')"
            :disabled="disabled"
        >
            <i class="fab fa-neos icon" /> 네이버페이
        </button>
        <button
            class="payBtn kakao"
            @click="callPay('KAKAOPAY')"
            :disabled="disabled"
        >
            <i class="fas fa-comment icon" /> 카카오페이
        </button>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    productName: String,
    amount: Number,
    quantity: Number,
    userInfo: Object,
    disabled: Boolean,
});

const callPay = (payMethod) => {
    console.log(props.productName);
    const orderNo = new Date()
        .toISOString()
        .replace(/[-:.TZ]/g, "")
        .slice(0, 14); // YYYYMMDDHHMMSS
    const params = {
        PAYMETHOD: payMethod, // "NAVERPAY" or "KAKAOPAY"
        TYPE: "P",
        CPID: "CTS15178", // 테스트용 가맹점 ID
        ORDERNO: orderNo,
        PRODUCTTYPE: "1", // 실물상품
        // AMOUNT: props.amount.toString(),
        AMOUNT: 100,

        PRODUCTNAME: props.productName,
        PRODUCTCODE: "TESTPD01",
        USERID: props.userInfo?._id || "GUEST",
        RESERVEDSTRING: "",
        HOMEURL: "https://www.naver.com", // 실제 결제 완료 후 이동할 URL
        TAXFREECD: "00",
        TELNO2: "0",
    };

    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "https://apitest.kiwoompay.co.kr/pay/link");
    form.setAttribute("target", "KIWOOMPAY");
    form.setAttribute("accept-charset", "euc-kr");

    window.open("", "KIWOOMPAY", "width=468,height=750");

    for (const key in params) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form); // 제출 후 제거
};
</script>

<style scoped>
.kiwoomPayButtons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
}

.payBtn {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.payBtn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.payBtn .icon {
    font-size: 18px;
}

/* 네이버페이 스타일 */
.payBtn.naver {
    background-color: #03c75a;
}
.payBtn.naver:hover {
    background-color: #02b14d;
}

/* 카카오페이 스타일 */
.payBtn.kakao {
    background-color: #fee500;
    color: #3c1e1e;
}
.payBtn.kakao:hover {
    background-color: #ffdd00;
}
</style>
