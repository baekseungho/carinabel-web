<template>
    <section class="home">
        <Banner />
        <div class="container">
            <h1 style="color: #fff; font-size: 120px">찢</h1>
            <div class="product-grid">
                <ProductCard
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                />
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
    store.dispatch("fetchProducts");
});
</script>

<style scoped>
.product-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
</style>
