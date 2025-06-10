<template>
    <div class="kit-container">
        <h1 class="kit-title">키트 상품</h1>
        <div class="kit-grid">
            <Card v-for="kit in kits" :key="kit.id" class="kit-card" @click="goToDetail(kit._id)">
                <CardImage :src="kit.imagePath || '/img/default_kit.png'" :alt="kit.kitName" />
                <CardContent>
                    <h3 class="kit-name">{{ kit.kitName }}</h3>
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

const kits = ref([]);
const kitCategory = ref("");
const router = useRouter();
const store = useStore();
const token = localStorage.getItem("token");
const getKits = () => {
    ProductService.getKits(token)
        .then((response) => {
            console.log("성공:", response.data);
            kitCategory.value = response.data.category;
            kits.value = response.data;
        })
        .catch((error) => {
            console.error(error);
            alert("데이터를 불러오는데 실패하였습니다.");
        });
};

onMounted(() => {
    // 데이터 로드
    getKits();
    kitCategory.value = essentialOils.category;
    kits.value = essentialOils.items;
});

function goToDetail(kitId) {
    console.log(kitId);
    router.push({ name: "KitDetail", params: { id: kitId } });
}
</script>

<style scoped>
.kit-container {
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.kit-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #444;
}

.kit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 24px;
    width: 100%;
    max-width: 1200px;
}

.kit-name {
    margin-top: 10px;
    font-weight: 600;
    text-align: center;
    color: #333;
}
</style>
