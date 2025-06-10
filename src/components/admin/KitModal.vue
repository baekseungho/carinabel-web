<template>
    <div class="modalOverlay">
        <div class="modalContent">
            <h2 class="modalTitle">키트 구성 추가</h2>

            <div class="kitForm">
                <div class="formSection">
                    <label>키트 이름</label>
                    <input v-model="kitName" type="text" placeholder="키트 이름 입력" />

                    <label>키트 설명</label>
                    <textarea v-model="description" placeholder="키트 설명 입력"></textarea>

                    <label>리스트 이미지 경로</label>
                    <input v-model="imagePath" type="text" placeholder="/img/kit_thumb.png" />

                    <label>상세 이미지 경로</label>
                    <input v-model="detailImage" type="text" placeholder="/img/kit_detail.png" />

                    <label>키트 가격</label>
                    <input v-model.number="price" type="number" placeholder="할인된 키트 가격" />

                    <div class="originalPriceDisplay">
                        기존 총합 가격:
                        <strong>{{ originalPrice.toLocaleString() }}원</strong>
                    </div>
                </div>

                <div class="productsSection">
                    <h3>상품 목록</h3>
                    <div class="productList">
                        <div v-for="product in products" :key="product._id" class="productItem">
                            <img :src="product.imagePath" alt="thumb" class="thumb" />
                            <div class="info">
                                <div>{{ product.koreanName }}</div>
                                <div>{{ product.consumerPrice.toLocaleString() }}원</div>
                            </div>
                            <input v-model.number="quantities[product._id]" type="number" min="1" placeholder="수량" />
                            <button @click="addToKit(product)">추가</button>
                        </div>
                    </div>
                </div>

                <div class="selectedSection">
                    <h3>선택된 구성</h3>
                    <div class="selectedList">
                        <div v-for="(item, index) in selectedProducts" :key="index" class="selectedItem">
                            <span>{{ item.koreanName }} ({{ item.quantity }}개)</span>
                            <button @click="removeFromKit(index)">제거</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modalButtons">
                <button class="confirm" @click="submitKit">등록</button>
                <button class="cancel" @click="$emit('close')">취소</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import AdminService from "@/api/AdminService";

const props = defineProps({
    editTarget: Object, // 수정 대상 키트 정보
});
const emit = defineEmits(["close", "created"]);
const products = ref([]);
const selectedProducts = ref([]);
const quantities = ref({});
const kitName = ref("");
const description = ref("");
const imagePath = ref("");
const detailImage = ref("");
const price = ref(0);
const originalPrice = ref(0);

const fetchProducts = () => {
    const token = localStorage.getItem("token");
    AdminService.getAllProducts(token)
        .then((res) => {
            products.value = res.data;
        })
        .catch((err) => console.error("❌ 상품 불러오기 실패:", err));
};

const addToKit = (product) => {
    const quantity = quantities.value[product._id] || 1;
    if (selectedProducts.value.some((p) => p._id === product._id)) return;
    selectedProducts.value.push({ ...product, quantity });
    calculateOriginalPrice();
};

const removeFromKit = (index) => {
    selectedProducts.value.splice(index, 1);
    calculateOriginalPrice();
};

const calculateOriginalPrice = () => {
    originalPrice.value = selectedProducts.value.reduce((sum, item) => sum + item.consumerPrice * item.quantity, 0);
};
const submitKit = () => {
    const token = localStorage.getItem("token");
    const kitData = {
        kitName: kitName.value,
        description: description.value,
        price: price.value,
        originalPrice: originalPrice.value,
        imagePath: imagePath.value,
        detailImage: detailImage.value,
        products: selectedProducts.value.map((p) => ({
            productId: p._id,
            quantity: p.quantity,
        })),
    };

    const isEditing = !!props.editTarget;

    const request = isEditing
        ? AdminService.updateKit(props.editTarget._id, kitData, token)
        : AdminService.createKit(kitData, token);

    request
        .then(() => {
            alert(isEditing ? "키트가 수정되었습니다." : "키트가 등록되었습니다.");
            emit("created");
            emit("close");
        })
        .catch((err) => {
            console.error("❌ 키트 등록/수정 실패:", err);
            alert("작업 실패");
        });
};

watch(
    () => props.editTarget,
    (kit) => {
        if (kit) {
            // 수정일 경우: 데이터 채움
            kitName.value = kit.kitName;
            description.value = kit.description;
            price.value = kit.price;
            originalPrice.value = kit.originalPrice;
            imagePath.value = kit.imagePath;
            detailImage.value = kit.detailImage;
            selectedProducts.value = kit.products.map((item) => ({
                ...item.productId,
                quantity: item.quantity,
            }));
            calculateOriginalPrice();
        } else {
            // 추가 모드일 경우: 초기화
            kitName.value = "";
            description.value = "";
            price.value = 0;
            originalPrice.value = 0;
            imagePath.value = "";
            detailImage.value = "";
            selectedProducts.value = [];
            quantities.value = {};
        }
    },
    { immediate: true }
);

onMounted(fetchProducts);
</script>

<style scoped>
.modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}
.modalContent {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    width: 90vw;
    max-width: 1200px;
    max-height: 95vh;
    overflow-y: auto;
}
.modalTitle {
    font-size: 1.5rem;
    margin-bottom: 16px;
    font-weight: bold;
}
.kitForm {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
}
.formSection,
.productsSection,
.selectedSection {
    flex: 1;
    min-width: 300px;
}
.formSection input,
.formSection textarea {
    width: 100%;
    padding: 8px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 6px;
}
.originalPriceDisplay {
    margin-top: 8px;
    font-size: 0.9rem;
    color: #666;
}
.productList {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 500px;
    overflow-y: auto;
}
.productItem {
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
}
.productItem .thumb {
    width: 50px;
    height: 50px;
    object-fit: contain;
    border-radius: 6px;
}
.productItem .info {
    flex: 1;
}
.productItem input {
    width: 60px;
    padding: 4px;
    margin-right: 8px;
}
.selectedList {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 500px;
    overflow-y: auto;
    border-left: 1px solid #eee;
    padding-left: 12px;
}
.selectedItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #ccc;
    padding: 4px 0;
}
.modalButtons {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    gap: 12px;
}
.confirm,
.cancel {
    padding: 10px 20px;
    font-size: 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}
.confirm {
    background: #444;
    color: white;
}
.cancel {
    background: #ccc;
}
</style>
