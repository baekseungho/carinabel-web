<template>
    <section class="home">
        <Banner />
        <div class="">
            <div class="product-grid">
                상품및 홍보할 공간
                <ProductCard v-for="product in products" :key="product.id" :product="product" />
            </div>
        </div>
        <Testimonial />
    </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import Banner from "@/components/Banner.vue";
import ProductCard from "@/components/ProductCard.vue";
import Testimonial from "@/components/Testimonial.vue";

const store = useStore();
const products = computed(() => store.getters.products);

onMounted(() => {
    // store.dispatch("fetchProducts");
});
</script>

<style scoped>
.product-grid {
    display: flex;
    /* flex-wrap: wrap; */
    /* gap: 20px; */
    border: 2px solid #cc8a94;
    width: 100%;
    height: 1200px;
    color: #cc8a94;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
}
</style>
