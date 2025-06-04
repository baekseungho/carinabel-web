<template>
    <div class="pageContainer">
        <div class="pageHeader">
            <h1>정보관리</h1>
            <p>내 정보를 한눈에 확인해보세요.</p>
        </div>
        <div class="infoView">
            <h2 class="sectionTitle">본인정보</h2>
            <table>
                <tbody>
                    <tr>
                        <th>회원명</th>
                        <td>{{ profile.fullName }}</td>
                    </tr>
                    <tr>
                        <th>회원ID</th>
                        <td>{{ profile.email }}</td>
                    </tr>
                    <tr>
                        <th>회원직급</th>
                        <td>{{ profile.membershipLevel }}</td>
                    </tr>
                    <tr>
                        <th>등록일자</th>
                        <td>{{ formatDate(profile.createdAt) }}</td>
                    </tr>
                    <tr>
                        <th>추천인명</th>
                        <td>{{ profile.referrerName || "-" }} ({{ profile.referrerEmail || "-" }})</td>
                    </tr>
                    <tr>
                        <th>생년월일</th>
                        <td>{{ formatBirthday(profile.birthday) }}</td>
                    </tr>
                    <tr>
                        <th>휴대폰번호</th>
                        <td>{{ maskPhone(profile.phone) }}</td>
                    </tr>
                    <tr>
                        <th>주소</th>
                        <td>{{ profile.address || "-" }}</td>
                    </tr>
                </tbody>
            </table>

            <h2 class="sectionTitle">계좌정보</h2>
            <table>
                <tbody>
                    <tr>
                        <th>예금주</th>
                        <td>{{ profile.fullName }}</td>
                    </tr>
                    <tr>
                        <th>계좌번호</th>
                        <td>{{ maskAccountNumber(profile.accountNumber) }}</td>
                    </tr>
                    <tr>
                        <th>은행명</th>
                        <td>{{ profile.bankName }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="btnBox"><button class="editBtn" @click="showModal = true">계좌정보 수정</button></div>
        </div>
        <EditAccountModal v-if="showModal" @close="showModal = false" @updated="fetchProfile" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import UserService from "@/api/UserService";
import EditAccountModal from "@/components/myPage/EditAccountModal.vue";
const profile = ref({});
const token = JSON.parse(localStorage.getItem("user"))?.token;
const showModal = ref(false);
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
        2,
        "0"
    )}`;
}

function maskAccountNumber(accNum) {
    if (!accNum) return "-";
    return accNum.slice(0, 8) + "****";
}
function maskPhone(phone) {
    return phone?.replace(/(\d{3})\d{4}(\d{4})/, "$1-****-$2");
}

function formatBirthday(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
        2,
        "0"
    )}`;
}
onMounted(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;
    console.log(token);
    UserService.getUserProfile(token)
        .then((response) => {
            profile.value = response.data;

            if (response.data.token) {
                user.token = response.data.token;
                localStorage.setItem("user", JSON.stringify(user));
            }

            console.log("✅ 추천 통계 로드 완료:", response.data);
        })
        .catch((error) => {
            console.error("❌ 추천 통계 로드 실패:", error);
        });
});
</script>

<style scoped>
.pageContainer {
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.5s ease;
}

.pageHeader {
    border-bottom: 2px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 30px;
}

.pageHeader h1 {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 6px;
}

.pageHeader p {
    font-size: 16px;
    color: #999;
}

.infoView {
    padding: 20px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
    /* max-width: 700px; */
    margin: auto;
}

.sectionTitle {
    background-color: #333;
    color: #fff;
    padding: 10px 15px;
    font-size: 18px;
    border-radius: 4px;
    margin-top: 30px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

th,
td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

th {
    width: 30%;
    background-color: #f8f8f8;
    color: #444;
    font-weight: 600;
}
.btnBox {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: end;
}

.editBtn {
    margin-top: 16px;
    padding: 10px 20px;
    background-color: #cc8a94;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}
.editBtn:hover {
    background-color: #ca717f;
}
</style>
