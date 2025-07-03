<template>
    <div class="qnaCreatePage">
        <h2 class="pageTitle">문의하기</h2>

        <div class="productInfo">
            <img :src="imagePath || '/img/default.jpg'" alt="상품 이미지" class="productImage" />
            <div class="productDetails">
                <h3>{{ productName }}</h3>
            </div>
        </div>

        <form class="qnaForm" @submit.prevent="submitQna">
            <div class="formGroup">
                <label for="category">카테고리</label>
                <select v-model="form.category" id="category">
                    <option disabled value="">카테고리 선택</option>
                    <option>상품</option>
                    <option>배송</option>
                    <option>결제</option>
                    <option>기타</option>
                </select>
            </div>

            <div class="formGroup">
                <label for="title">제목</label>
                <input type="text" id="title" v-model="form.title" placeholder="제목을 입력하세요" />
            </div>

            <div class="formGroup">
                <label for="content">내용</label>
                <textarea id="content" v-model="form.content" rows="8" placeholder="문의 내용을 입력하세요"></textarea>
            </div>

            <div class="formButtons">
                <button type="submit" class="themaBgColor2" :disabled="!isFormValid">문의 등록</button>
                <button type="button" class="cancelBtn" @click="cancel">취소</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import QnaService from "@/api/QnaService";

const route = useRoute();
const router = useRouter();
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const productName = route.query.productName;
const imagePath = route.query.imagePath;
const orderId = route.query.orderId;

const form = ref({
    title: "",
    content: "",
    category: "",
    orderId,
    productName,
    imagePath,
    userId: user?._id || "",
});

const isFormValid = computed(() => {
    return form.value.title.trim() && form.value.content.trim() && form.value.category;
});

const submitQna = () => {
    QnaService.createQna(form.value, token)
        .then(() => {
            alert("문의가 등록되었습니다.");
            router.push("/qna");
        })
        .catch((err) => {
            console.error("❌ 문의 등록 실패:", err);
        });
};

const cancel = () => {
    router.push("/qna");
};
</script>
<style scoped>
.qnaCreatePage {
    max-width: 700px;
    margin: 0 auto;
    margin-top: 60px;
    padding: 32px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.pageTitle {
    font-size: 26px;
    margin-bottom: 28px;
    font-weight: 700;
    text-align: center;
    color: #333;
}
.productInfo {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 32px;
    background-color: #f9f9f9;
    padding: 16px;
    border-radius: 10px;
}
.productImage {
    width: 100px;
    height: 100px;
    object-fit: contain;
    border-radius: 10px;
    border: 1px solid #ddd;
}
.productDetails h3 {
    font-size: 18px;
    color: #333;
    margin: 0;
}
.qnaForm {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.formGroup label {
    font-weight: 600;
    margin-bottom: 6px;
    display: block;
    color: #444;
}
.formGroup input,
.formGroup select,
.formGroup textarea {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 15px;
    background-color: #fdfdfd;
}
.formGroup select:invalid {
    color: #999;
}
.formButtons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 12px;
}
.formButtons button {
    padding: 12px 24px;
    font-size: 15px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    color: #fff;
}
.formButtons .themaBgColor2:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.cancelBtn {
    background-color: #bbb;
    color: #fff;
}
.cancelBtn:hover {
    background-color: #888;
}
</style>
