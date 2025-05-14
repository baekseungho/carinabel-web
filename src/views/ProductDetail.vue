<template>
    <div class="productDetailContainer">
        <div class="backButton" @click="goBack">
            <div class="back bigIcon"></div>
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
                <p v-if="isAuthenticated" class="productPrice">
                    <span class="consumerPrice">소비자가: {{ formatPrice(product.consumerPrice) }}원</span>
                    <span class="memberPrice">회원가: {{ formatPrice(product.memberPrice) }}원</span>
                </p>
                <p v-else class="productPrice">
                    <span class="memberPrice">소비자가: {{ formatPrice(product.consumerPrice) }}원</span>
                    <span class="consumerPrice">회원가: {{ formatPrice(product.memberPrice) }}원</span>
                </p>
                <div class="productDescription">
                    <h2>제품 설명</h2>
                    <p>
                        {{ product.description }}
                    </p>
                </div>

                <button class="addToCartButton" @click="addToCart(product)">구매하기</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import essentialOils from "../assets/data/essentialoils.js";
import { useStore } from "vuex";
import AuthService from "@/api/AuthService";

const store = useStore();
const route = useRoute();
const router = useRouter();
const product = ref({});
const isAuthenticated = computed(() => store.getters.isAuthenticated);

onMounted(() => {
    const productId = Number(route.params.id);
    product.value = essentialOils.items.find((item) => item.id === productId) || {};
});

function formatPrice(price) {
    if (!price) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function addToCart(product) {
    if (!product.koreanName) return;
    console.log(product);
    const token = localStorage.getItem("token");
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    const data = {
        userId: userId,
        additionalAmount: product.memberPrice * 2,
    };
    console.log(data, token);
    AuthService.updateUserProfile(data.userId, data.additionalAmount, token)
        .then((response) => {
            console.log(response);
            alert(`${product.koreanName} 를 구매했습니다.`);
        })
        .catch((error) => {
            console.error(error);
            alert("구매에 실패했습니다.");
        });
}

function goBack() {
    router.push("/products/essential");
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
    top: 20px;
    left: 20px;
    background-color: transparent;
    color: #333;
    padding: 10px 20px;
    font-size: 14px;
    border: none;
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
.addToCartButton {
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
}
.addToCartButton:hover {
    background-color: #c97582;
}
</style>
