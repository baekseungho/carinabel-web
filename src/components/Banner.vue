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

        <!-- <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div> -->
        <div class="swiper-pagination"></div>
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
}

.swiper {
    width: 100%;
    height: 100%;
}

.slide-content {
    width: 100%;
    height: 100%;
    background-size: contain;
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

.swiper-button-next,
.swiper-button-prev {
    color: #fff;
    font-size: 24px;
    z-index: 10;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.swiper-button-next {
    right: 10px;
}

.swiper-button-prev {
    left: 10px;
}

.swiper-pagination {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
}
</style>
