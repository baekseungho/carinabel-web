<template>
    <div class="product-container">
        <h1 class="product-title">회원전용상품</h1>
        <div class="product-grid">
            <Card v-for="product in products" :key="product.id" class="product-card" @click="goToDetail(product.id)">
                <CardImage :src="product.imagePath || '/img/default.jpg'" :alt="product.koreanName" />
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

const products = ref([]);
const productCategory = ref("");
const router = useRouter();

onMounted(() => {
    // 데이터 로드
    productCategory.value = essentialOils.category;
    products.value = essentialOils.items;
});

function goToDetail(productId) {
    router.push({ name: "ProductDetail", params: { id: productId } });
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
