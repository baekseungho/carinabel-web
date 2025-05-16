<template>
    <div class="productManagerContainer">
        <h1>상품 관리</h1>

        <div class="productForm">
            <input v-model="category" placeholder="카테고리" />
            <input v-model="productName" placeholder="상품명 (영문)" />
            <input v-model="koreanName" placeholder="상품명 (한글)" />
            <input v-model="volume" type="number" placeholder="용량 (ml)" />
            <input v-model="consumerPrice" type="number" placeholder="소비자가격 (원)" />
            <input v-model="imagePath" placeholder="리스트 이미지 경로" />
            <input v-model="detailImage" placeholder="상세 이미지 경로" />
            <button @click="addProduct">상품 추가</button>
        </div>

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
                {{ product.consumerPrice }}원 / 회원가 {{ product.memberPrice }}원

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
            <input v-model="editForm.imagePath" placeholder="리스트 이미지 경로" />
            <input v-model="editForm.detailImage" placeholder="상세 이미지 경로" />
            <button @click="updateProduct">수정 완료</button>
            <button @click="cancelEdit">취소</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const products = ref([]);
const category = ref("");
const productName = ref("");
const koreanName = ref("");
const volume = ref("");
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
    imagePath: "",
    detailImage: "",
});

// 상품 목록 불러오기
const fetchProducts = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/products", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        products.value = response.data;
    } catch (error) {
        console.error("상품 목록 로딩 오류:", error.response || error);
        alert("상품 목록을 불러오는 데 실패했습니다.");
    }
};

// 상품 추가
const addProduct = async () => {
    try {
        const response = await axios.post("http://localhost:5000/api/products/add", {
            category: category.value,
            productName: productName.value,
            koreanName: koreanName.value,
            volume: volume.value,
            consumerPrice: consumerPrice.value,
            imagePath: imagePath.value || "/img/default.jpg",
            detailImage: detailImage.value || "/img/default_detail.jpg",
        });
        products.value.push(response.data.product);
        category.value = "";
        productName.value = "";
        koreanName.value = "";
        volume.value = "";
        consumerPrice.value = "";
        imagePath.value = "";
        detailImage.value = "";
        alert("상품이 성공적으로 추가되었습니다.");
    } catch (error) {
        console.error(error);
        alert("상품 추가에 실패했습니다.");
    }
};
// 상품 삭제
const deleteProduct = async (productId) => {
    try {
        await axios.delete(`http://localhost:5000/api/products/delete/${productId}`);
        products.value = products.value.filter((p) => p._id !== productId);
        alert("상품이 성공적으로 삭제되었습니다.");
    } catch (error) {
        console.error(error);
        alert("상품 삭제에 실패했습니다.");
    }
};

// 상품 수정 시작
const editProduct = (product) => {
    editMode.value = true;
    editForm.value = { ...product };
};

// 상품 수정 완료
const updateProduct = async () => {
    try {
        const response = await axios.put(`http://localhost:5000/api/products/update/${editForm.value._id}`, {
            category: editForm.value.category,
            productName: editForm.value.productName,
            koreanName: editForm.value.koreanName,
            volume: editForm.value.volume,
            consumerPrice: editForm.value.consumerPrice,
        });
        const index = products.value.findIndex((p) => p._id === editForm.value._id);
        products.value[index] = response.data.product;
        editMode.value = false;
        alert("상품이 성공적으로 수정되었습니다.");
    } catch (error) {
        console.error(error);
        alert("상품 수정에 실패했습니다.");
    }
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
    };
};

// 초기 로딩 시 상품 목록 불러오기
onMounted(() => {
    fetchProducts();
});
</script>

<style scoped>
.productManagerContainer {
    width: 60%;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
</style>
