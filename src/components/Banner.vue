<template>
    <div class="banner-container">
        <Swiper
            :modules="[Autoplay, Navigation, Pagination]"
            :loop="true"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            :navigation="true"
            :pagination="{ clickable: true }"
            class="swiper"
        >
            <SwiperSlide v-for="banner in filteredBanners" :key="banner.id">
                <div
                    class="slide-content"
                    :style="{ backgroundImage: `url(${banner.imagePath})` }"
                >
                    <h5 class="banner-title">{{ banner.name }}</h5>
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import banners from "@/assets/data/banners.js";

const filteredBanners = computed(() =>
    banners.filter((banner) => banner.role === "ROLE_USER")
);
</script>

<style scoped>
.banner-container {
    width: 100%;
    height: 600px;
    overflow: hidden;
    position: relative;
    --swiper-navigation-color: #cc8a94; /* 네비게이션 버튼 색상 */
    --swiper-pagination-color: #cc8a94; /* 페이지네이션 색상 */
}

.swiper {
    width: 100%;
    height: 100%;
}

.slide-content {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 48px;
    font-weight: bold;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
}
</style>
