<template>
    <div class="kiwoomPayButtons">
        <button class="payBtn naver" @click="callPay('NAVERPAY')" :disabled="disabled">
            <i class="fab fa-neos icon" /> 네이버페이
        </button>
        <button class="payBtn kakao" @click="callPay('KAKAOPAY')" :disabled="disabled">
            <i class="fas fa-comment icon" /> 카카오페이
        </button>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import AuthService from "@/api/AuthService";
import OrderService from "@/api/OrderService";

const router = useRouter();
const store = useStore();

const props = defineProps({
    product: Object,
    userInfo: Object,
    quantity: Number,
    disabled: Boolean,
});

const callPay = async (payMethod) => {
    const userId = props.userInfo?._id;
    const token = props.userInfo?.token;

    if (!userId || !token) {
        alert("로그인이 필요합니다.");
        return;
    }

    try {
        const amount = props.product.memberPrice * props.quantity;

        // ✅ 먼저 회원 누적 금액 업데이트
        const updatePromise = AuthService.updateUserProfile(userId, amount, token);

        // ✅ 주문 미리 생성 (상태: "입금대기")
        const orderPromise = OrderService.createOrder(
            {
                userId,
                productName: props.product.koreanName,
                amount,
                quantity: props.quantity,
                imagePath: props.product.imagePath,
                status: "입금대기", // 미리 생성 시 입금대기
            },
            token
        );

        const [userRes, orderRes] = await Promise.all([updatePromise, orderPromise]);
        store.dispatch("login", userRes.data);

        const orderId = orderRes.data._id;
        const homeUrl = `${window.location.origin}/order-complete/${orderId}`;

        // ✅ 결제창 호출
        const orderNo = new Date()
            .toISOString()
            .replace(/[-:.TZ]/g, "")
            .slice(0, 14);
        const params = {
            PAYMETHOD: payMethod,
            TYPE: "P",
            CPID: "CTS15178",
            ORDERNO: orderNo,
            PRODUCTTYPE: "1",
            // AMOUNT: amount.toString(),
            AMOUNT: 100,
            PRODUCTNAME: props.product.koreanName,
            PRODUCTCODE: "TESTPD01",
            USERID: userId,
            RESERVEDSTRING: "",
            HOMEURL: homeUrl,
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
        document.body.removeChild(form);
    } catch (error) {
        console.error("❌ 결제 준비 실패:", error);
        const message = error.response?.data?.message || "결제 준비에 실패했습니다.";
        alert(message);
    }
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
