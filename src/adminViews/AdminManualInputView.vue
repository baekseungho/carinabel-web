<template>
    <div class="manualInputPage">
        <h1 class="pageTitle">📝 관리자 수기 회원 등록 + 주문 생성</h1>

        <!-- ✅ 회원가입 폼 -->
        <section class="formSection">
            <h2>👤 수기 회원 등록</h2>
            <div class="formGroup" v-for="field in userFields" :key="field.key">
                <label>{{ field.label }}</label>

                <!-- ✅ 휴대폰 입력일 때만 포맷팅 적용 -->
                <template v-if="field.key === 'phone'">
                    <input
                        :value="formattedPhone"
                        @input="formatPhoneInput"
                        :placeholder="field.placeholder || '010-1234-5678'"
                    />
                </template>

                <!-- ✅ 그 외 필드는 기본 처리 -->
                <template v-else>
                    <input
                        :type="field.type || 'text'"
                        v-model="userForm[field.key]"
                        :placeholder="field.placeholder || ''"
                    />
                </template>
            </div>

            <div class="formGroup">
                <label>가입일자</label>
                <input type="date" v-model="userForm.createdAt" />
            </div>

            <button class="submitBtn" @click="submitUser">회원 등록</button>
        </section>

        <hr style="margin: 40px 0" />

        <!-- ✅ 주문 생성 폼 -->
        <section class="formSection">
            <h2>🛒 수기 주문 생성</h2>

            <div class="formGroup">
                <label>회원 ID (자동입력됨)</label>
                <input v-model="orderForm.userId" readonly style="background: #f4f4f4" />
            </div>

            <div class="formGroup">
                <label>상품 이름</label>
                <input v-model="orderForm.productName" placeholder="라벤더 오일 or 키트 이름" />
            </div>

            <div class="formGroup">
                <label>상품 이미지 경로</label>
                <input v-model="orderForm.imagePath" placeholder="/products/라벤더.png" />
            </div>

            <div class="formGroup">
                <label>수량</label>
                <input type="number" v-model.number="orderForm.quantity" />
            </div>

            <div class="formGroup">
                <label>총 결제 금액</label>
                <input type="number" v-model.number="orderForm.amount" />
            </div>

            <div class="formGroup">
                <label>주문 유형</label>
                <select v-model="orderForm.orderType">
                    <option value="oil">오일</option>
                    <option value="kit">키트</option>
                </select>
            </div>

            <div class="formGroup">
                <label>배송 예정일 (선택)</label>
                <input type="date" v-model="orderForm.deliveryDate" />
            </div>

            <button class="submitBtn" @click="submitOrder">주문 등록</button>
        </section>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

import AdminService from "@/api/AdminService";

const token = localStorage.getItem("token");

const formattedPhone = computed(() => {
    const raw = userForm.value.phone;
    if (!raw) return "";
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
});

const formatPhoneInput = (event) => {
    let raw = event.target.value.replace(/\D/g, ""); // 숫자만 추출

    if (raw.length > 11) raw = raw.slice(0, 11);

    userForm.value.phone = raw;

    event.target.value = formattedPhone.value; // 표시값도 포맷
};
// 회원가입 입력 폼
const userForm = ref({
    fullName: "",
    email: "",
    phone: "",
    birthday: "",
    password: "",
    agreedToTerms: true,
    accountNumber: "",
    socialSecurityNumber: "",
    bankName: "",
    address: "",
    referrermemberId: "",
    createdAt: "",
});

const userFields = [
    { key: "fullName", label: "이름" },
    { key: "email", label: "이메일" },
    { key: "phone", label: "휴대폰 번호" },
    { key: "birthday", label: "생년월일", type: "date" },
    { key: "password", label: "비밀번호", type: "password" },
    { key: "accountNumber", label: "계좌번호" },
    { key: "socialSecurityNumber", label: "주민번호" },
    { key: "bankName", label: "은행명" },
    { key: "address", label: "주소" },
    { key: "referrermemberId", label: "추천인 회원번호" },
];

// 주문 입력 폼
const orderForm = ref({
    userId: "",
    productName: "",
    imagePath: "",
    quantity: 1,
    amount: 0,
    orderType: "oil",
    deliveryDate: "",
});

const submitUser = () => {
    if (!userForm.value.fullName || !userForm.value.phone || !userForm.value.password || !userForm.value.birthday) {
        alert("회원 필수 항목을 입력해주세요.");
        return;
    }

    AdminService.manualRegister(userForm.value, token)
        .then((res) => {
            alert("✅ 회원 등록 완료!");
            console.log("신규 회원 ID:", res.data.userId);
            orderForm.value.userId = res.data.userId;
        })
        .catch((err) => {
            const msg = err.response?.data?.message || "회원 등록 실패";
            alert(msg);
            console.error("❌ 회원 등록 에러:", err);
        });
};

const submitOrder = () => {
    if (!orderForm.value.userId || !orderForm.value.productName || !orderForm.value.amount) {
        alert("주문 필수 항목을 입력해주세요.");
        return;
    }

    AdminService.manualOrder(orderForm.value, token)
        .then(() => {
            alert("✅ 주문 등록 완료!");
        })
        .catch((err) => {
            const msg = err.response?.data?.message || "주문 등록 실패";
            alert(msg);
            console.error("❌ 주문 등록 에러:", err);
        });
};
</script>

<style scoped>
.manualInputPage {
    padding: 2rem;
    margin-left: 220px;
    max-width: 600px;
}

.pageTitle {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 2rem;
}

h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #333;
}

.formSection {
    margin-bottom: 2rem;
}

.formGroup {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
}

.formGroup label {
    font-weight: 600;
    margin-bottom: 4px;
}

input,
select {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
}

.submitBtn {
    margin-top: 1rem;
    padding: 10px 20px;
    background-color: #cc8a94;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: 0.2s ease;
}

.submitBtn:hover {
    background-color: #a0666f;
}
</style>
