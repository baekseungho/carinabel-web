<template>
    <div class="buyProductButton">
        <button class="payBtn" @click="startCardPayment">카드결제</button>
    </div>
</template>

<script setup>
import { computed } from "vue";
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

const payUrl = "https://apitest.kiwoompay.co.kr/pay/link"; // 개발
// const payUrl = " https://api.kiwoompay.co.kr/pay/link"; // 운영
const server = "LIVE";
const cpid = "CTS15178";
const tmnid = "WGP329355";
const authkey = "pk_9d09-2da619-d50-63aa9";

const totalAmount = computed(() => {
    // return 100;
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
        // ✅ 1. 회원 누적금액 업데이트 & 주문 생성
        const updatePromise = AuthService.updateUserProfile(userId, totalAmount.value, token);
        const orderPromise = OrderService.createOrder(
            {
                userId,
                productName: props.product.koreanName,
                amount: totalAmount.value,
                quantity: props.quantity,
                imagePath: props.product.imagePath,
                status: "결제완료",
            },
            token
        );
        const [userRes, orderRes] = await Promise.all([updatePromise, orderPromise]);
        store.dispatch("login", userRes.data);

        const orderId = orderRes.data._id;

        // ✅ 2. 결제 완료 후 이동할 페이지
        const homeUrl = `${window.location.origin}/order-complete/${orderId}`;
        const failUrl = `${window.location.origin}/payment/fail`;

        // ✅ 3. 결제 요청 파라미터 세팅
        const params = {
            SERVER: server,
            TYPE: "P",
            PAYMETHOD: "CARD",
            CPID: cpid,
            RESERVEDSTRING: tmnid,
            // KEY: authkey,
            ORDERNO: orderNo,
            PRODUCTTYPE: "1",
            TAXFREECD: "00",
            BILLTYPE: "1",
            AMOUNT: totalAmount.value.toString(),
            PRODUCTNAME: props.product.koreanName,
            PRODUCTCODE: props.product._id,
            USERID: userId,
            USERNAME: userName,
            EMAIL: email,
            HOMEURL: homeUrl,
            FAILURL: failUrl,
        };

        // ✅ 4. 결제 form 전송 (EUC-KR 인코딩)
        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", payUrl);
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
.buyProductButton {
    background-color: #1a73e8;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.buyProductButton {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
}

.payBtn {
    padding: 4px 20px;
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
</style>
