<template>
    <div class="productDetailContainer">
        <div class="backButton" @click="goBack">
            <div class="back normalIcon"></div>
        </div>

        <div class="productDetailWrapper">
            <div class="productImageWrapper">
                <img
                    :src="kit.imagePath || '/img/default.jpg'"
                    :alt="kit.kitName"
                    class="productImage"
                />
            </div>

            <div class="productInfoWrapper">
                <h1 class="productTitle">
                    {{ kit.kitName }}
                </h1>

                <p class="productVolume">구성품:</p>
                <ul>
                    <li v-for="(item, index) in kit.products" :key="index">
                        - {{ item.productInfo.koreanName }} ×
                        {{ item.quantity }} (재고:
                        {{ item.productInfo.stock || 0 }}개)
                    </li>
                </ul>

                <p class="productVolume">
                    총 구성 원가: {{ formatPrice(kit.originalPrice) }}원
                </p>
                <p class="productPrice">
                    <span class="memberPrice"
                        >회원가: {{ formatPrice(kit.memberPrice) }}원</span
                    >
                </p>

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
                    <button
                        class="buyProductButton"
                        @click="buyKit"
                        :disabled="!isStockAvailable"
                    >
                        구매하기
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ProductService from "@/api/ProductService.js";
import AuthService from "@/api/AuthService";
import OrderService from "@/api/OrderService";
import { useStore } from "vuex";

const route = useRoute();
const router = useRouter();
const store = useStore();
const token = localStorage.getItem("token");
const kit = ref({ products: [] });
const quantity = ref(1);

const getKit = () => {
    ProductService.getKit(route.params.id, token)
        .then((res) => {
            kit.value = res.data;
        })
        .catch((err) => {
            console.error(err);
            alert("키트 정보를 불러오지 못했습니다.");
        });
};

onMounted(() => {
    getKit();
});

function formatPrice(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
}

// 모든 구성품이 수량만큼 재고가 충분한지 확인
const isStockAvailable = computed(() => {
    return kit.value.products.every(
        (item) => item.productInfo.stock >= item.quantity * quantity.value
    );
});

function increaseQuantity() {
    if (!isStockAvailable.value) {
        alert("구성품 중 하나 이상이 재고 부족입니다.");
        return;
    }
    quantity.value++;
    if (!isStockAvailable.value) {
        quantity.value--;
        alert("재고가 부족하여 더 이상 추가할 수 없습니다.");
    }
}

function decreaseQuantity() {
    if (quantity.value > 1) quantity.value--;
}

function buyKit() {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    if (!userId || !token) {
        alert("로그인이 필요합니다.");
        return;
    }

    const amount = kit.value.memberPrice * quantity.value;

    AuthService.updateUserProfile(userId, amount, token)
        .then(() => {
            return OrderService.createOrder(
                {
                    userId,
                    productName: kit.value.kitName,
                    amount,
                    quantity: quantity.value,
                    imagePath: kit.value.imagePath,
                    status: "결제완료",
                },
                token
            );
        })
        .then(() => {
            alert(
                `${kit.value.kitName} 키트를 ${quantity.value}개 구매했습니다.`
            );
            getKit(); // 재고 다시 불러오기
        })
        .catch((err) => {
            console.error(err);
            const msg = err.response?.data?.message || "구매에 실패했습니다.";
            alert(msg);
        });
}

function goBack() {
    router.push("/products/kits");
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
.productInfoWrapper ul {
    margin: 0 0 16px 0;
    padding-left: 20px;
    list-style: disc;
    color: #444;
    font-size: 1.05rem;
}
.productInfoWrapper li {
    margin-bottom: 8px;
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
    font-size: 1.2rem;
    font-weight: normal;
    color: #777;
    margin-top: 5px;
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
    /* justify-content: space-between; */
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
    margin-right: 12px;
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
        /* flex-direction: column; */
        padding: 24px;
    }

    .productTitle {
        font-size: 1.8rem;
    }

    .productPrice {
        font-size: 1.2rem;
    }

    .buyProductButton {
        font-size: 1rem;
        padding: 12px 24px;
    }

    .productQuantity {
        font-size: 1rem;
    }
}

/* 반응형 - 600px 이하 */
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
    .productInfoWrapper ul {
        list-style: none;
    }

    .productInfoWrapper {
        min-width: 100%;
        text-align: center;
    }

    .productImage {
        height: auto;
    }
    .buyProductButton {
        width: 100%;
    }
}
</style>
