<template>
    <div class="cartContainer">
        <h1 class="cartTitle">🛒 장바구니</h1>

        <div class="cartItems">
            <div class="cartItem" v-for="item in cartItems" :key="item.id">
                <div class="cartItemImageWrapper">
                    <img
                        :src="item.imagePath || '/img/default.jpg'"
                        :alt="item.koreanName"
                        class="cartItemImage"
                    />
                </div>

                <div class="cartItemDetails">
                    <h2 class="cartItemTitle">{{ item.koreanName }}</h2>
                    <p class="cartItemVolume">용량: {{ item.volume }}ml</p>
                    <p class="cartItemPrice">
                        회원가: {{ formatPrice(item.memberPrice) }}원
                    </p>
                    <div class="cartItemQuantity">
                        <button @click="decreaseQuantity(item)">
                            <div class="minus smallIcon"></div>
                        </button>
                        <span>{{ item.quantity }}</span>
                        <button @click="increaseQuantity(item)">
                            <div class="plus smallIcon"></div>
                        </button>
                    </div>
                    <button
                        class="removeItemButton"
                        @click="removeItem(item.id)"
                    >
                        <div class="x smallIcon"></div>
                        삭제
                    </button>
                </div>
            </div>
        </div>

        <div class="cartSummary">
            <p>
                총 금액:
                <span class="totalPrice">{{ formatPrice(totalPrice) }}원</span>
            </p>
            <button class="checkoutButton">주문하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";

// 장바구니 임시 데이터 (나중에 API 연동 예정)
const cartItems = ref([
    {
        id: 1,
        koreanName: "프랑킨센스 오일",
        volume: 15,
        memberPrice: 86000,
        quantity: 1,
        imagePath: "/products/프랑킨센스.png",
    },
    {
        id: 2,
        koreanName: "라벤더 오일",
        volume: 15,
        memberPrice: 30000,
        quantity: 2,
        imagePath: "/products/라벤더.png",
    },
]);

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function increaseQuantity(item) {
    item.quantity++;
}

function decreaseQuantity(item) {
    if (item.quantity > 1) item.quantity--;
}

function removeItem(itemId) {
    cartItems.value = cartItems.value.filter((item) => item.id !== itemId);
}

const totalPrice = computed(() =>
    cartItems.value.reduce(
        (sum, item) => sum + item.memberPrice * item.quantity,
        0
    )
);
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
    margin-bottom: 20px;
    background-color: #f7f7f7;
    border-radius: 15px;
    padding: 20px;
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
</style>
