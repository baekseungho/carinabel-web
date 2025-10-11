<template>
  <div class="buyProductButton" @click="temporaryPayment">카드결제</div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
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
  orderType: String,
});

const router = useRouter();
const route = useRoute();
const store = useStore();

// const payUrl = "https://apitest.kiwoompay.co.kr/pay/link"; // 개발
const payUrl = " https://api.kiwoompay.co.kr/pay/link"; // 운영
const server = "LIVE";
const cpid = "CWP11504";
const testcpid = "CTS15178";
const tmnid = "WGP329355";

const totalAmount = computed(() => {
  return (props.product.memberPrice || 0) * props.quantity;
});

// 로그인한 사용자 정보
const userId = props.userInfo?._id || "guest";
const userName = props.userInfo?.name || "비회원";
const email = props.userInfo?.email || "guest@example.com";
const token = props.userInfo?.token;

const temporaryPayment = () => {
  alert("현재 엔지엔몰에서만 구매가 가능합니다. 엔지엔몰로 이동합니다.");
  window.open(
    "https://ngnmall.com/pc/product/category-list?prdCtgIdx=25",
    "_blank"
  );
};

const startCardPayment = async () => {
  if (!userId || !token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    // 🛒 1. 주문 유형이 장바구니일 경우
    if (props.orderType === "cart") {
      // 장바구니 상품 정보 준비
      const simplifiedCartItems = props.product.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

      const firstProductName = props.product[0]?.productId.koreanName || "상품";
      const extraCount = props.product.length - 1;
      const productName =
        extraCount > 0
          ? `${firstProductName} 외 ${extraCount}개`
          : firstProductName;

      const totalQuantity = props.product.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const totalPrice = props.product.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const orderRes = await OrderService.createOrder(
        {
          userId,
          productName,
          imagePath: props.product[0]?.productId.imagePath || "",
          amount: totalPrice,
          quantity: totalQuantity,
          status: "입금대기",
          orderType: "cart",
          cartItems: simplifiedCartItems,
        },
        token
      );

      const orderId = orderRes.data._id;
      const orderNumber = orderRes.data.orderNumber;

      const homeUrl = `${window.location.origin}/order-complete/${orderId}`;
      const failUrl = `${window.location.origin}/payment/fail`;

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
        AMOUNT: totalPrice.toString(), // 실제 금액
        // AMOUNT: 100, // 테스트용
        PRODUCTNAME: productName,
        PRODUCTCODE: "cart-mixed",
        USERID: userId,
        USERNAME: userName,
        EMAIL: email,
        HOMEURL: homeUrl,
        FAILURL: failUrl,
      };

      const paymentWindow = window.open(
        "",
        "KIWOOMPAY",
        "width=468,height=750"
      );

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

      const checkInterval = setInterval(async () => {
        if (paymentWindow.closed) {
          clearInterval(checkInterval);

          const paidOrderId = localStorage.getItem("paidOrder");
          localStorage.removeItem("paidOrder");

          if (paidOrderId === orderId) return;

          try {
            await OrderService.deleteUnpaidOrder(orderId, token);
            alert("결제가 완료되지 않아 주문이 취소되었습니다.");
          } catch (err) {
            console.error("❌ 주문 삭제 실패:", err);
            alert("결제 취소 처리 중 오류가 발생했습니다.");
          }
        }
      }, 1000);

      return; // ✅ cart 흐름은 여기서 종료
    }

    // 💧 oil 또는 🧴 kit 주문 처리 (기존 그대로 유지)
    const orderRes = await OrderService.createOrder(
      {
        userId,
        productName:
          props.orderType === "oil"
            ? props.product.koreanName
            : props.product.kitName,
        amount: totalAmount.value,
        quantity: props.quantity,
        imagePath: props.product.imagePath,
        status: "입금대기",
        orderType: props.orderType,
      },
      token
    );

    const orderId = orderRes.data._id;
    const orderNumber = orderRes.data.orderNumber;

    const homeUrl = `${window.location.origin}/order-complete/${orderId}`;
    const failUrl = `${window.location.origin}/payment/fail`;

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
      AMOUNT: totalAmount.value.toString(),
      // AMOUNT: 100,
      PRODUCTNAME:
        props.orderType === "oil"
          ? props.product.koreanName
          : props.product.kitName,
      PRODUCTCODE: props.product._id,
      USERID: userId,
      USERNAME: userName,
      EMAIL: email,
      HOMEURL: homeUrl,
      FAILURL: failUrl,
    };

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

    const checkInterval = setInterval(async () => {
      if (paymentWindow.closed) {
        clearInterval(checkInterval);

        const paidOrderId = localStorage.getItem("paidOrder");
        localStorage.removeItem("paidOrder");

        if (paidOrderId === orderId) return;

        try {
          await OrderService.deleteUnpaidOrder(orderId, token);
          alert("결제가 완료되지 않아 주문이 취소되었습니다.");
        } catch (err) {
          console.error("❌ 주문 삭제 실패:", err);
          alert("결제 취소 처리 중 오류가 발생했습니다.");
        }
      }
    }, 1000);
  } catch (error) {
    console.error("❌ 결제 준비 실패:", error);
    const message =
      error.response?.data?.message || "결제 준비에 실패했습니다.";
    alert(message);
  }
};

onMounted(() => {
  console.log(props);
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
