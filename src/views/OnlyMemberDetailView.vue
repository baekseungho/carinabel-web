<template>
    <div class="productDetailContainer">
        <div class="backButton" @click="goBack">
            <div class="back normalIcon"></div>
        </div>

        <div class="productDetailWrapper">
            <div class="productImageWrapper">
                <img :src="product.imagePath || '/img/default.jpg'" :alt="product.koreanName" class="productImage" />
            </div>

            <div class="productInfoWrapper">
                <h1 class="productTitle">
                    {{ product.koreanName }}
                    <span class="productName">{{ product.productName }}</span>
                </h1>
                <p class="productVolume">용량: {{ product.volume || 0 }}ml</p>
                <p class="productVolume">재고: {{ product.stock || 0 }}개</p>

                <p class="productPrice">
                    <template v-if="product.consumerPrice !== product.memberPrice">
                        <span class="consumerPrice">소비자가: {{ formatPrice(product.consumerPrice) }}원</span>
                        <span class="memberPrice">회원가: {{ formatPrice(product.memberPrice) }}원</span>
                    </template>
                    <template v-else>
                        <span class="memberPrice">가격: {{ formatPrice(product.memberPrice) }}원</span>
                    </template>
                </p>

                <!-- <div class="productDescription">
                    <h2>제품 설명</h2>
                    <p>
                        {{ product.description }}
                    </p>
                </div> -->

                <div class="productQuantity">
                    <label>수량:</label>
                    <div class="quantityControls">
                        <button @click="decreaseQuantity">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>{{ quantity }}</span>
                        <button @click="increaseQuantity">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="buyBtnBox">
                    <button class="buyProductButton" @click="buyProduct(product)" :disabled="product.stock === 0">
                        구매하기
                    </button>
                    <button class="buyProductButton" @click="addToCart(product._id)" :disabled="product.stock === 0">
                        장바구니에 담기
                    </button>
                </div>
                <div class="btnBox">
                    <Winpay
                        :productName="product.koreanName"
                        :amount="product.memberPrice * quantity"
                        :quantity="quantity"
                        :userInfo="user"
                        :disabled="product.stock === 0"
                    />
                </div>
                <div class="btnBox">
                    <KiwoomPay
                        :product="product"
                        :userInfo="user"
                        :quantity="quantity"
                        :disabled="product.stock === 0"
                    />
                </div>
            </div>
        </div>
        <div class="productDaildescription">
            <img :src="product.detailImage || '/img/default.jpg'" :alt="product.koreanName" class="productImage" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import AuthService from "@/api/AuthService";
import OrderService from "@/api/OrderService";
import ProductService from "@/api/ProductService.js";
import CartService from "@/api/CartService.js";
import Winpay from "@/components/payment/Winpay.vue";
import KiwoomPay from "@/components/payment/KiwoompayView.vue";
const store = useStore();
const route = useRoute();

const router = useRouter();
const product = ref({});
const isAuthenticated = computed(() => store.getters.isAuthenticated);
const token = localStorage.getItem("token");
const user = ref(JSON.parse(localStorage.getItem("user")));
const quantity = ref(1); // 수량 상태 추가

const getProduct = () => {
    console.log(route.params.id, token);
    ProductService.getProduct(route.params.id, token)
        .then((response) => {
            console.log("성공:", response.data);
            product.value = response.data;
        })
        .catch((error) => {
            console.error(error);
            alert("데이터를 불러오는데 실패하였습니다.");
        });
};

onMounted(() => {
    getProduct();
});

function formatPrice(price) {
    if (!price) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function buyProduct(product) {
    const userId = user.value?._id;
    const token = user.value?.token;

    if (!userId || !token) {
        alert("로그인이 필요합니다.");
        return;
    }

    const amount = product.memberPrice * quantity.value;

    const updatePromise = AuthService.updateUserProfile(userId, amount, token);
    const orderPromise = OrderService.createOrder(
        {
            userId,
            productName: product.koreanName,
            amount,
            quantity: quantity.value,
            imagePath: product.imagePath,
            status: "결제완료",
        },
        token
    );

    Promise.all([updatePromise, orderPromise])
        .then(([userRes, orderRes]) => {
            alert(`${product.koreanName}를 ${quantity.value}개 구매했습니다.`);
            store.dispatch("login", userRes.data);

            getProduct();
            router.push(`/order-complete/${orderRes.data._id}`);
        })
        .catch((error) => {
            console.error("❌ 구매 실패:", error);
            const message = error.response?.data?.message || "구매에 실패했습니다.";
            alert(message);
        });
}
const addToCart = (productId) => {
    const token = localStorage.getItem("token");

    CartService.addToCart(productId, token)
        .then((response) => {
            console.log("성공:", response.data);
            alert("장바구니에 추가되었습니다.");
        })
        .catch((error) => {
            console.error(error);
            alert("데이터를 불러오는데 실패하였습니다.");
        });
};

function goBack() {
    router.push("/products/onlymember");
}

function increaseQuantity() {
    if (quantity.value < product.value.stock) {
        quantity.value++;
    } else {
        alert(`최대 주문 가능 수량은 ${product.value.stock}개입니다.`);
    }
}

function decreaseQuantity() {
    if (quantity.value > 1) quantity.value--;
}
</script>

<style scoped>
.productDetailContainer {
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    background-color: #f7f7f7;
}
.backButton {
    position: absolute;
    top: 8px;
    left: 20px;
    background-color: transparent;
    color: #333;
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid #eee;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    z-index: 10;
}
.backButton:hover {
    background-color: #cc8a94;
    color: #fff;
}
.productDetailWrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    max-width: 1000px;
    width: 100%;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    margin-top: 20px;
    margin-bottom: 20px;
}
.productImageWrapper {
    flex: 1;
    min-width: 300px;
    max-width: 500px;
    overflow: hidden;
    border-radius: 20px;
    background-color: #f7f7f7;
}
.productImage {
    width: 100%;
    object-fit: contain;
    border-radius: 20px;
}
.productInfoWrapper {
    position: relative;
    flex: 1;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}
.productTitle {
    font-size: 2.2rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
}
.productName {
    display: block;
    font-size: 1.4rem;
    font-weight: bold;
    color: #777;
    margin-top: 5px;
}
.productNameInline {
    display: inline-block;
    font-size: 1.2rem;
    font-weight: normal;
    color: #888;
    margin-left: 4px;
}

.quantityControls i {
    font-size: 14px;
}
.productVolume {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 10px;
}
.productPrice {
    margin-bottom: 20px;
    font-size: 1.4rem;
    font-weight: bold;
    color: #444;
}
.consumerPrice {
    text-decoration: line-through;
    color: #888;
    margin-right: 10px;
}
.memberPrice {
    margin-right: 10px;
    color: #cc8a94;
}
.productDescription {
    margin-bottom: 20px;
}
.productDescription h2 {
    font-size: 1.8rem;
    margin-bottom: 10px;
    color: #333;
}
.productDescription p {
    font-size: 1.2rem;
    color: #555;

    white-space: pre-wrap;
}
.buyBtnBox {
    display: flex;
    width: 100%;
    justify-content: space-between;
}
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
    align-self: flex-start;
    /* margin-right: 12px; */
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

.productQuantity {
    margin: 20px 0;
    font-size: 18px;
    color: #444;
    display: flex;
    align-items: center;
    gap: 15px;
}

.quantityControls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.quantityControls button {
    background-color: #cc8a94;
    border: none;
    /* padding: 8px 12px; */
    height: 32px;
    width: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.quantityControls button:hover {
    background-color: #ca717f;
}

@media (max-width: 1200px) {
    .productDetailWrapper {
        padding: 24px;
    }

    .productTitle {
        font-size: 1.8rem;
    }

    .productPrice {
        font-size: 1.2rem;
    }

    .buyProductButton {
        font-size: 0.8rem;
        padding: 12px 24px;
    }

    .productQuantity {
        font-size: 1rem;
    }
}

@media (max-width: 600px) {
    .productDetailContainer {
        padding: 20px 10px;
    }

    .backButton {
        top: 4px;
        left: 10px;
        padding: 4px 8px;
        font-size: 12px;
    }

    .productTitle {
        font-size: 1.4rem;
        text-align: center;
    }
    .productVolume {
        text-align: center;
    }
    .productName {
        font-size: 1rem;
    }

    .productPrice {
        font-size: 1rem;
        text-align: center;
    }

    .buyBtnBox {
        flex-direction: column;
        gap: 10px;
        align-items: stretch;
    }
    .productQuantity {
        display: flex;
        justify-content: center;
    }
    .productImageWrapper {
        min-width: 100%;
    }

    .productInfoWrapper {
        min-width: 100%;
    }

    .productDaildescription .productImage {
        width: 100%;
        height: auto;
    }
    .buyProductButton {
        width: 100%;
    }
}
</style>
