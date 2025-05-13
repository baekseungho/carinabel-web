<template>
    <div class="navigateContainer">
        <div class="navigateContent">
            <h1>찾아오시는 길</h1>
            <p>
                대전광역시 유성구 은구남로7번길 73, 3층<br />
                전화: 000-0000-0000
            </p>
            <div id="map" class="mapWrapper"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {});
</script>

<style scoped>
.navigateContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    background-color: #f7f7f7;
}
.navigateContent {
    max-width: 1000px;
    text-align: center;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}
.navigateContent h1 {
    font-size: 2.2rem;
    margin-bottom: 20px;
    color: #333;
}
.navigateContent p {
    font-size: 1.2rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 40px;
}
.mapWrapper {
    width: 100%;
    height: 500px;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 20px;
}
</style>
