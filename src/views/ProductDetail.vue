<template>
  <div class="productDetailContainer">
    <button class="backButton" @click="goBack">← 목록으로 돌아가기</button>

    <div class="productDetailWrapper">
      <div class="productImageWrapper">
        <img
          :src="product.imagePath || '/img/default.jpg'"
          :alt="product.koreanName"
          class="productImage"
        />
      </div>

      <div class="productInfoWrapper">
        <h1 class="productTitle">
          {{ product.koreanName }}
          <span class="productName">{{ product.productName }}</span>
        </h1>
        <p class="productVolume">용량: {{ product.volume || 0 }}ml</p>
        <p class="productPrice">
          <span class="consumerPrice"
            >소비자가: {{ formatPrice(product.consumerPrice) }}원</span
          >
          <span class="memberPrice"
            >회원가: {{ formatPrice(product.memberPrice) }}원</span
          >
        </p>

        <div class="productDescription">
          <h2>제품 설명</h2>
          <p>
            프리미엄 에센셜 오일로, 다양한 아로마 테라피와 일상 생활에서 활용할
            수 있는 고품질 제품입니다.
          </p>
        </div>

        <button class="addToCartButton" @click="addToCart(product)">
          장바구니 담기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import essentialOils from "../assets/data/essentialoils.js";

const route = useRoute();
const router = useRouter();
const product = ref({});

onMounted(() => {
  const productId = Number(route.params.id);
  product.value =
    essentialOils.items.find((item) => item.id === productId) || {};
});

function formatPrice(price) {
  if (!price) return "0";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function addToCart(product) {
  if (!product.koreanName) return;
  alert(`${product.koreanName}이(가) 장바구니에 담겼습니다.`);
}

function goBack() {
  router.push("/products");
}
</script>

<style scoped>
.productDetailContainer {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.backButton {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #f3f3f3;
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
  background-color: #e07b39;
  color: #fff;
}

.productDetailWrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  max-width: 1200px;
  width: 100%;
  margin-top: 60px;
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
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.productName {
  display: block;
  font-size: 18px;
  font-weight: normal;
  color: #777;
  margin-top: 5px;
}

.productVolume {
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
}

.productPrice {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #444;
}

.consumerPrice {
  text-decoration: line-through;
  color: #888;
  margin-right: 10px;
}

.memberPrice {
  color: #e07b39;
}

.productDescription {
  margin-bottom: 20px;
}

.productDescription h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.productDescription p {
  font-size: 18px;
  color: #666;
}

.addToCartButton {
  background-color: #e07b39;
  color: #fff;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-start;
}

.addToCartButton:hover {
  background-color: #d4682d;
}
</style>
