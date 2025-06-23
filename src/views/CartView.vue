<template>
    <div class="cartContainer">
        <h1 class="cartTitle">🛒 장바구니</h1>

        <div class="cartItems" v-if="cartItems.length > 0">
            <div class="cartItem" v-for="item in cartItems" :key="item._id">
                <div class="cartItemImageWrapper">
                    <img
                        :src="item.productId.imagePath || '/img/default.jpg'"
                        :alt="item.productId.koreanName"
                        class="cartItemImage"
                    />
                </div>

                <div class="cartItemDetails">
                    <h2 class="cartItemTitle">
                        {{ item.productId.koreanName }}
                    </h2>
                    <p class="cartItemVolume">
                        용량: {{ item.productId.volume }}ml
                    </p>
                    <p class="cartItemPrice">
                        회원가: {{ formatPrice(item.price) }}원
                    </p>
                    <div class="cartItemQuantity">
                        <button @click="decreaseQuantity(item)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>{{ item.quantity }}</span>
                        <button @click="increaseQuantity(item)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>

                    <button
                        class="removeItemButton"
                        @click="deleteItem(item._id)"
                    >
                        <div class="x smallIcon"></div>
                        삭제
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="emptyCartMessage">장바구니가 비어있습니다.</div>

        <div class="cartSummary" v-if="cartItems.length > 0">
            <p>
                총 금액:
                <span class="totalPrice">{{ formatPrice(totalPrice) }}원</span>
            </p>
            <button class="checkoutButton" @click="buyCart()">주문하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import CartService from "@/api/CartService.js";
import AuthService from "@/api/AuthService.js";
import OrderService from "@/api/OrderService.js";
import { useStore } from "vuex";

const cartItems = ref([]);
const store = useStore();
const token = localStorage.getItem("token");
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const getCartList = () => {
    CartService.getCartList(token)
        .then((response) => {
            console.log("성공:", response.data);
            cartItems.value = response.data;
        })
        .catch((error) => {
            console.error(error);
            alert("데이터를 불러오는데 실패하였습니다.");
        });
};

// 🔄 수량 증가
function increaseQuantity(item) {
    item.quantity++;
    updateCart(item);
}

// 🔄 수량 감소
function decreaseQuantity(item) {
    if (item.quantity > 1) {
        item.quantity--;
        updateCart(item);
    }
}

const updateCart = (item) => {
    console.log(item);

    CartService.updateCart(item._id, item.quantity, token)
        .then((response) => {
            console.log("성공:", response.data);
            getCartList();
        })
        .catch((error) => {
            console.error(error);
            alert("수량 업데이트에 실패했습니다.");
        });
};
// 🗑️ 장바구니에서 상품 삭제
const deleteItem = (itemId) => {
    console.log(itemId);
    CartService.deleteCartItem(itemId, token)
        .then((response) => {
            console.log("성공:", response.data);
            alert("상품이 장바구니에서 삭제되었습니다.");
            getCartList();
        })
        .catch((error) => {
            console.error(error);
            alert("상품 삭제에 실패했습니다.");
        });
};

function buyCart() {
    if (!totalPrice.value) {
        alert("장바구니가 비어있습니다.");
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;
    const token = user.token;

    // 1️⃣ 수당/등급 업데이트
    AuthService.updateUserProfile(userId, totalPrice.value, token)
        .then((response) => {
            // 2️⃣ 주문기록 → 장바구니 아이템마다
            const orderPromises = cartItems.value.map((item) => {
                console.log(
                    "🛒 주문 생성용 데이터:",
                    item.productId.koreanName,
                    item.price,
                    item.quantity
                );
                return OrderService.createOrder(
                    {
                        userId,
                        productName: item.productId.koreanName, // ✅ 이 값이 undefined면 에러 발생
                        imagePath: item.productId.imagePath,
                        amount: item.price * item.quantity,
                        quantity: item.quantity,
                        status: "결제완료",
                    },
                    token
                );
            });

            return Promise.all(orderPromises).then(() => {
                alert("장바구니 상품들을 구매했습니다.");
                store.dispatch("login", response.data);
                getCartList(); // 장바구니 비우기
            });
        })
        .catch((error) => {
            console.error("❌ 장바구니 구매 실패:", error);
            alert("구매에 실패했습니다.");
        });
}

// 📝 총 금액 계산
const totalPrice = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

onMounted(() => {
    getCartList();
});
</script>
<style scoped>
.cartContainer {
    padding: 40px 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.cartTitle {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #444;
    text-align: center;
}

.cartItems {
    margin-bottom: 40px;
}

.cartItem {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 16px;
    background-color: #f7f7f7;
    border-radius: 15px;
    padding: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.cartItemImageWrapper {
    width: 150px;
    height: 150px;
    overflow: hidden;
    border-radius: 15px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cartItemImage {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 15px;
}

.cartItemDetails {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.cartItemTitle {
    font-size: 24px;
    font-weight: bold;
    color: #444;
    margin-bottom: 10px;
}

.cartItemVolume {
    font-size: 16px;
    color: #777;
    margin-bottom: 10px;
}

.cartItemPrice {
    font-size: 20px;
    font-weight: bold;
    color: #cc8a94;
    margin-bottom: 10px;
}

.cartItemQuantity {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.cartItemQuantity button {
    background-color: #cc8a94;
    color: #fff;
    border: none;
    padding: 10px 15px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.cartItemQuantity button:hover {
    background-color: #ca717f;
}

.removeItemButton {
    background-color: #ff4d4d;
    color: #fff;
    border: none;
    padding: 10px 12px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    align-self: flex-start;
    transition: background-color 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.removeItemButton > div {
    margin-right: 0.4rem;
}

.removeItemButton:hover {
    background-color: #cc0000;
}

.cartSummary {
    text-align: right;
    font-size: 24px;
    font-weight: bold;
    color: #444;
}

.totalPrice {
    color: #cc8a94;
}

.checkoutButton {
    background-color: #cc8a94;
    color: #fff;
    padding: 15px 30px;
    font-size: 18px;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.2s;
}

.checkoutButton:hover {
    background-color: #ca717f;
}

.emptyCartMessage {
    text-align: center;
    font-size: 1.5rem;
    color: #999;
}

@media (max-width: 600px) {
    .cartContainer {
        padding: 20px 10px;
    }

    .cartTitle {
        font-size: 24px;
    }

    .cartItem {
        /* flex-direction: column; */
        /* align-items: flex-start; */
        padding: 12px;
    }

    .cartItemImageWrapper {
        /* width: 100%; */
        height: auto;

        max-height: 200px;
    }

    .cartItemImage {
        width: 100%;
        height: auto;
    }

    .cartItemTitle {
        font-size: 18px;
    }

    .cartItemVolume,
    .cartItemPrice {
        font-size: 14px;
    }

    .cartItemQuantity button {
        padding: 4px 8px;
        font-size: 14px;
    }

    .removeItemButton {
        font-size: 14px;
        padding: 8px 10px;
    }

    .cartSummary {
        font-size: 18px;
        text-align: center;
    }

    .checkoutButton {
        width: 100%;
        font-size: 16px;
        padding: 12px;
    }

    .emptyCartMessage {
        font-size: 1.2rem;
    }
}
</style>
