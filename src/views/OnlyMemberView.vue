<template>
  <div class="product-container">
    <h1 class="product-title">회원전용상품</h1>
    <div class="product-grid">
      <Card
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="goToDetail(product._id)"
      >
        <CardImage
          :src="product.imagePath || '/img/default_product.png'"
          :alt="product.koreanName"
        />
        <CardContent>
          <h3 class="product-name">{{ product.koreanName }}</h3>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import essentialOils from "../assets/data/essentialoils.js";
import { useRouter } from "vue-router";
import Card from "@/components/ui/Card.vue";
import CardContent from "@/components/ui/CardContent.vue";
import CardImage from "@/components/ui/CardImage.vue";
import ProductService from "@/api/ProductService.js";
import { useStore } from "vuex";

const products = ref([]);
const productCategory = ref("");
const router = useRouter();
const store = useStore();
const token = localStorage.getItem("token");
const getProducts = () => {
  ProductService.getProducts(token)
    .then((response) => {
      console.log("성공:", response.data);
      productCategory.value = response.data.category;
      products.value = response.data;
    })
    .catch((error) => {
      console.error(error);
      alert("데이터를 불러오는데 실패하였습니다.");
    });
};

onMounted(() => {
  // 데이터 로드
  getProducts();
  productCategory.value = essentialOils.category;
  products.value = essentialOils.items;
});

function goToDetail(productId) {
  console.log(productId);
  router.push({ name: "OnlymemberDetail", params: { id: productId } });
}
</script>

<style scoped>
.product-container {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #444;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1200px;
}

.product-name {
  margin-top: 10px;
  font-weight: 600;
  text-align: center;
  color: #333;
}
</style>
