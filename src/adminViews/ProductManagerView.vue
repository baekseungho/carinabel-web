<template>
    <div class="productManagerContainer">
        <div style="width: 20%">
            <h2>상품 관리</h2>
            <div class="productForm">
                <input v-model="category" placeholder="카테고리" />
                <input v-model="productName" placeholder="상품명 (영문)" />
                <input v-model="koreanName" placeholder="상품명 (한글)" />
                <input v-model="volume" type="number" placeholder="용량 (ml)" />
                <input v-model="consumerPrice" type="number" placeholder="소비자가격 (원)" />
                <input v-model="stock" type="number" placeholder="재고 수량" />
                <input v-model="imagePath" placeholder="리스트 이미지 경로" />
                <input v-model="detailImage" placeholder="상세 이미지 경로" />
                <button @click="addProduct">상품 추가</button>
            </div>
        </div>

        <div style="width: 79%">
            <h2>상품 목록</h2>
            <ul>
                <li style="display: flex; align-items: center" v-for="product in products" :key="product._id">
                    <img
                        style="width: 40px; height: 80px"
                        :src="product.imagePath"
                        alt="상품 이미지"
                        class="productThumbnail"
                    />
                    <strong>{{ product.koreanName }}</strong> ({{ product.category }}) - {{ product.volume }}ml /
                    {{ product.consumerPrice }}원 / 회원가 {{ product.memberPrice }}원 / 재고 {{ product.stock }}개
                    <button @click="deleteProduct(product._id)">삭제</button>
                    <button @click="editProduct(product)">수정</button>
                </li>
            </ul>
            <div v-if="editMode" class="productEditForm">
                <h2>상품 수정</h2>
                <input v-model="editForm.category" placeholder="카테고리" />
                <input v-model="editForm.productName" placeholder="상품명 (영문)" />
                <input v-model="editForm.koreanName" placeholder="상품명 (한글)" />
                <input v-model="editForm.volume" type="number" placeholder="용량 (ml)" />
                <input v-model="editForm.consumerPrice" type="number" placeholder="소비자가격 (원)" />
                <input v-model="editForm.stock" type="number" placeholder="재고 수량" />
                <input v-model="editForm.imagePath" placeholder="리스트 이미지 경로" />
                <input v-model="editForm.detailImage" placeholder="상세 이미지 경로" />
                <button @click="updateProduct">수정 완료</button>
                <button @click="cancelEdit">취소</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminService from "@/api/AdminService";

const products = ref([]);
const category = ref("");
const productName = ref("");
const koreanName = ref("");
const volume = ref("");
const stock = ref("");
const consumerPrice = ref("");
const imagePath = ref("");
const detailImage = ref("");
const editMode = ref(false);
const editForm = ref({
    _id: "",
    category: "",
    productName: "",
    koreanName: "",
    volume: "",
    consumerPrice: "",
    stock: 0,
    imagePath: "",
    detailImage: "",
});

const token = localStorage.getItem("token");

// 상품 목록 불러오기
const fetchProducts = () => {
    AdminService.getAllProducts(token)
        .then((res) => {
            products.value = res.data;
        })
        .catch((err) => {
            console.error("❌ 상품 목록 로딩 실패:", err.response || err);
            alert("상품 목록을 불러오는 데 실패했습니다.");
        });
};

// 상품 추가
const addProduct = () => {
    const productData = {
        category: category.value,
        productName: productName.value,
        koreanName: koreanName.value,
        volume: volume.value,
        consumerPrice: consumerPrice.value,
        stock: stock.value,
        imagePath: imagePath.value || "/img/default.jpg",
        detailImage: detailImage.value || "/img/default_detail.jpg",
    };

    AdminService.addProduct(productData, token)
        .then((res) => {
            products.value.push(res.data.product);
            category.value = "";
            productName.value = "";
            koreanName.value = "";
            volume.value = "";
            consumerPrice.value = "";
            stock.value = "";

            imagePath.value = "";
            detailImage.value = "";
            alert("상품이 성공적으로 추가되었습니다.");
        })
        .catch((err) => {
            console.error("❌ 상품 추가 실패:", err.response || err);
            alert("상품 추가에 실패했습니다.");
        });
};

// 상품 삭제
const deleteProduct = (productId) => {
    AdminService.deleteProduct(productId, token)
        .then(() => {
            products.value = products.value.filter((p) => p._id !== productId);
            alert("상품이 성공적으로 삭제되었습니다.");
        })
        .catch((err) => {
            console.error("❌ 상품 삭제 실패:", err.response || err);
            alert("상품 삭제에 실패했습니다.");
        });
};

// 상품 수정 시작
const editProduct = (product) => {
    editMode.value = true;
    editForm.value = { ...product };
};

// 상품 수정 완료
const updateProduct = () => {
    const updatedData = {
        category: editForm.value.category,
        productName: editForm.value.productName,
        koreanName: editForm.value.koreanName,
        volume: editForm.value.volume,
        consumerPrice: editForm.value.consumerPrice,
        stock: editForm.value.stock,
        imagePath: editForm.value.imagePath,
        detailImage: editForm.value.detailImage,
    };

    AdminService.updateProduct(editForm.value._id, updatedData, token)
        .then((res) => {
            const index = products.value.findIndex((p) => p._id === editForm.value._id);
            if (index !== -1) {
                products.value[index] = res.data.product;
            }
            editMode.value = false;
            alert("상품이 성공적으로 수정되었습니다.");
        })
        .catch((err) => {
            console.error("❌ 상품 수정 실패:", err.response || err);
            alert("상품 수정에 실패했습니다.");
        });
};

// 수정 취소
const cancelEdit = () => {
    editMode.value = false;
    editForm.value = {
        _id: "",
        category: "",
        productName: "",
        koreanName: "",
        volume: "",
        consumerPrice: "",
        stock: "",
        imagePath: "",
        detailImage: "",
    };
};

// 초기 로딩 시 상품 목록 불러오기
onMounted(() => {
    fetchProducts();
});
</script>

<style scoped>
.productManagerContainer {
    width: 90%;
    margin-left: 180px;
    padding: 20px;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
}

.productForm,
.productEditForm {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.productForm input,
.productEditForm input {
    width: calc(100% - 20px);
    margin: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

button {
    margin: 10px;
    padding: 10px 20px;
    background-color: #cc8a94;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #a0666f;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin-bottom: 10px;
    background-color: #ffffff;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
}
</style>
