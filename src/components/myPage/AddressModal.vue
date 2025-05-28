<template>
    <div class="modalOverlay">
        <div class="modalContainer">
            <h3>{{ address ? "배송지 수정" : "배송지 추가" }}</h3>

            <div class="formGroup">
                <label>받는사람</label>
                <input v-model="form.recipientName" placeholder="받는사람 이름" />
            </div>

            <div class="formGroup">
                <label>전화번호</label>
                <input v-model="form.phone" placeholder="전화번호 (선택)" />
            </div>

            <div class="formGroup">
                <label>휴대폰</label>
                <input v-model="form.mobile" placeholder="휴대폰 번호" />
            </div>

            <div class="formGroup">
                <label>주소</label>
                <div class="address-wrapper">
                    <div class="readonly-address">{{ form.baseAddress || "주소를 선택해주세요" }}</div>
                    <button type="button" class="search-btn" @click="searchAddress">주소 찾기</button>
                </div>
            </div>

            <div class="formGroup">
                <label>상세주소</label>
                <input type="text" v-model="form.detailAddress" placeholder="상세 주소 입력" />
            </div>

            <div class="formGroup checkbox">
                <input type="checkbox" id="default" v-model="form.isDefault" />
                <label for="default">기본 배송지로 설정</label>
            </div>

            <div class="modalActions">
                <button class="saveBtn" @click="saveAddress">주소록 저장</button>
                <button class="closeBtn" @click="$emit('close')">닫기</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, reactive } from "vue";
import AddressService from "@/api/AddressService";

const props = defineProps({
    address: Object,
});
const emit = defineEmits(["close", "saved"]);
const token = localStorage.getItem("token");

const form = reactive({
    recipientName: "",
    phone: "",
    mobile: "",
    baseAddress: "",
    detailAddress: "",
    isDefault: false,
});

watch(
    () => props.address,
    (val) => {
        if (val) {
            form.recipientName = val.recipientName;
            form.phone = val.phone;
            form.mobile = val.mobile;
            form.isDefault = val.isDefault;
            form.baseAddress = val.address?.split(" ")[0] || "";
            form.detailAddress = val.address?.split(" ").slice(1).join(" ") || "";
        } else {
            form.recipientName = "";
            form.phone = "";
            form.mobile = "";
            form.isDefault = false;
            form.baseAddress = "";
            form.detailAddress = "";
        }
    },
    { immediate: true }
);

const saveAddress = () => {
    if (!form.recipientName || !form.mobile || !form.baseAddress) {
        alert("받는사람, 휴대폰, 주소는 필수 입력 항목입니다.");
        return;
    }

    // 주소 조합
    const fullAddress = `${form.baseAddress} ${form.detailAddress}`.trim();
    const payload = {
        recipientName: form.recipientName,
        phone: form.phone,
        mobile: form.mobile,
        address: fullAddress,
        isDefault: form.isDefault,
    };

    if (props.address && props.address._id) {
        AddressService.updateAddress(props.address._id, payload, token)
            .then(() => emit("saved"))
            .catch((err) => {
                console.error("❌ 주소 수정 실패:", err);
                alert("주소 저장 중 오류가 발생했습니다.");
            });
    } else {
        AddressService.createAddress(payload, token)
            .then(() => emit("saved"))
            .catch((err) => {
                console.error("❌ 주소 생성 실패:", err);
                alert("주소 저장 중 오류가 발생했습니다.");
            });
    }
};
const searchAddress = () => {
    new window.daum.Postcode({
        oncomplete: function (data) {
            let fullAddr = data.address;
            if (data.addressType === "R") {
                if (data.bname !== "") fullAddr += ` (${data.bname})`;
                if (data.buildingName !== "") fullAddr += `, ${data.buildingName}`;
            }

            form.baseAddress = fullAddr; // ✅ 여기에 넣어야 화면에 반영됨
        },
    }).open();
};
</script>

<style scoped>
.modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
.modalContainer {
    background: #fff;
    padding: 32px;
    border-radius: 12px;
    width: 420px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.modalContainer h3 {
    margin-bottom: 20px;
    color: #333;
}
.formGroup {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
}
.formGroup input,
.formGroup textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
}

.formGroup input,
.readonly-address {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    width: 100%;
}
.formGroup.checkbox {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.formGroup.checkbox input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #cc8a94; /* 테마 색상 반영 */
    cursor: pointer;
}

.formGroup.checkbox label {
    font-size: 14px;
    color: #444;
    cursor: pointer;
    user-select: none;
}

.readonly-address {
    background: #f8f8f8;
    color: #444;
}
.address-wrapper {
    display: flex;
    gap: 10px;
}

.search-btn {
    padding: 10px 16px;
    background-color: #cc8a94;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}
.search-btn:hover {
    background-color: #ca717f;
}

.modalActions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}
.saveBtn {
    background-color: #cc8a94;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
}
.closeBtn {
    background-color: #aaa;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
}
</style>
