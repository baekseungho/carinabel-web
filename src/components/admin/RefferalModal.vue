<template>
    <div class="referralModal">
        <div class="modalOverlay" @click.self="closeModal"></div>
        <div class="modalContent">
            <h2 class="modalTitle">수당 상세 정보</h2>

            <div class="modalBody">
                <!-- 왼쪽: 수당 내역 -->
                <div class="modalSection left">
                    <h3 class="sectionTitle">수당 내역</h3>
                    <div class="recordTableWrapper">
                        <table class="recordTable">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>추천인</th>
                                    <th>수당액</th>
                                    <th>비율</th>
                                    <th>첫 구매</th>
                                    <th>날짜</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(record, index) in records" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ record.referredUserId.fullName }} ({{ record.referredUserId.memberId }})</td>
                                    <td>{{ formatPrice(record.amount) }}원</td>
                                    <td>{{ record.percentage }}%</td>
                                    <td>{{ record.firstPurchase ? "✅" : "-" }}</td>
                                    <td>{{ formatDate(record.date) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 오른쪽: 지급 처리 -->
                <!-- 오른쪽: 지급 처리 -->
                <div class="modalSection right">
                    <h3 class="sectionTitle">수당 지급 처리</h3>
                    <p><strong>미지급 수당:</strong> {{ formatPrice(user?.unpaidReferralEarnings) }}원</p>
                    <p><strong>계좌번호:</strong> {{ user?.accountNumber || "-" }}</p>
                    <p><strong>은행명:</strong> {{ user?.bankName || "-" }}</p>
                    <p><strong>사용자:</strong> {{ user?.fullName || "-" }}</p>
                    <p><strong>주민번호:</strong> {{ maskSsn(user?.socialSecurityNumber) }}</p>

                    <input
                        type="number"
                        v-model.number="payAmount"
                        placeholder="지급할 금액을 입력하세요"
                        class="amountInput"
                    />

                    <button @click="handlePayReferral" class="submitBtn">지급 처리</button>
                </div>
            </div>

            <button class="closeBtn" @click="closeModal">닫기</button>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import AdminService from "@/api/AdminService";

const props = defineProps({
    user: Object,
    token: String,
});
const emit = defineEmits(["close", "updated"]);

const records = ref([]);
const payAmount = ref(0);

onMounted(() => {
    console.log(props.user);
    if (props.user?._id && props.token) {
        AdminService.getReferralDetails(props.token, props.user._id)
            .then((res) => {
                records.value = res.data;
            })
            .catch((err) => {
                console.error("❌ 수당 상세 정보 조회 실패:", err);
                alert("수당 상세 정보를 불러오는 데 실패했습니다.");
            });
    }
});

const closeModal = () => {
    emit("close");
};

const handlePayReferral = () => {
    if (!payAmount.value || payAmount.value <= 0) return alert("지급할 금액을 입력해주세요.");
    if (payAmount.value > props.user.unpaidReferralEarnings) return alert("미지급 수당보다 많을 수 없습니다.");

    let data = {
        userId: props.user._id,
        amount: payAmount.value,
    };
    AdminService.payReferral(data, props.token)
        .then((res) => {
            alert("✅ 수당이 지급되었습니다.");
            emit("updated");
            closeModal();
        })
        .catch((err) => {
            console.error("❌ 수당 지급 실패:", err);
            alert("수당 지급 처리 중 오류 발생");
        });
};

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
};

const formatPrice = (val) => {
    return !val ? "0" : val.toLocaleString();
};
const maskSsn = (ssn) => {
    if (!ssn || ssn.length < 7) return "-";
    return ssn.substring(0, 7) + "******";
};
</script>

<style scoped>
.referralModal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}
.modalOverlay {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
}
.modalContent {
    position: relative;
    background: #fff;
    padding: 24px;
    width: 1100px;
    max-height: 1200px;
    overflow-y: auto;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
}
.modalTitle {
    font-size: 20px;
    margin-bottom: 20px;
    font-weight: bold;
}
.modalBody {
    display: flex;
    gap: 20px;
}
.modalSection {
    flex: 1;
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 6px;
}
.left .recordTableWrapper {
    max-height: 800px;
    overflow-y: auto;
}
.sectionTitle {
    font-weight: bold;
    margin-bottom: 12px;
}
.recordTable {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}
.recordTable th,
.recordTable td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}
.recordTable th {
    background-color: #f5f5f5;
    font-weight: bold;
}
.amountInput {
    margin-top: 12px;
    padding: 8px;
    width: 100%;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.submitBtn {
    margin-top: 12px;
    width: 100%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
}

.submitBtn:hover {
    background-color: #357c38;
}
.closeBtn {
    margin-top: 20px;
    align-self: flex-end;
    background: transparent;
    border: none;
    color: #888;
    cursor: pointer;
}
</style>
