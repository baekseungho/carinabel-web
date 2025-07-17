<template>
    <div class="modalOverlay" @click.self="close">
        <div class="modalContent">
            <h2>주문 취소 신청</h2>
            <textarea v-model="reason" placeholder="취소 사유를 입력해주세요."></textarea>
            <div class="modalButtons">
                <button class="cancelBtn" @click="close">닫기</button>
                <button class="confirmBtn" @click="submitCancel">주문취소신청하기</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import OrderService from "@/api/OrderService.js";

const props = defineProps({
    orderId: String,
    token: String,
});
const emit = defineEmits(["close", "submitted"]);

const reason = ref("");

const close = () => {
    emit("close");
};

const submitCancel = () => {
    if (!reason.value.trim()) {
        alert("취소 사유를 입력해주세요.");
        return;
    }

    const confirmed = confirm("정말 주문을 취소하시겠습니까?");
    if (!confirmed) return;

    OrderService.updateOrderStatus(props.orderId, "취소대기", props.token, reason.value)
        .then((res) => {
            alert("주문 취소 신청이 완료되었습니다.");
            emit("submitted", res.data.order);
        })
        .catch((error) => {
            const message = error.response?.data?.message || "주문취소 신청 중 오류가 발생했습니다.";
            alert(message);
        });
};
</script>
<style scoped>
.modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modalContent {
    background: #fff;
    padding: 30px;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    animation: fadeInUp 0.3s ease;
}

.modalContent h2 {
    font-size: 22px;
    margin-bottom: 16px;
    color: #333;
}

textarea {
    width: 100%;
    min-height: 100px;
    padding: 12px;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid #ccc;
    resize: none;
    margin-bottom: 20px;
}

.modalButtons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.cancelBtn,
.confirmBtn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
}

.cancelBtn {
    background-color: #eee;
}

.confirmBtn {
    background-color: #f44336;
    color: white;
}

@keyframes fadeInUp {
    from {
        transform: translateY(30px);
        opacity: 0;
    }
    to {
        transform: translateY(0px);
        opacity: 1;
    }
}
</style>
