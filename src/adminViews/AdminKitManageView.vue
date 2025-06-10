<template>
    <div class="adminPageWrapper">
        <div class="adminContent">
            <h2 class="pageTitle">키트 관리</h2>

            <button class="addBtn themaBgColor4" @click="showModal = true">키트 추가</button>

            <table class="dataTable">
                <thead>
                    <tr>
                        <th>이미지</th>
                        <th>키트명</th>
                        <th>설명</th>
                        <th>가격</th>
                        <th>원가</th>
                        <th>구성 상품</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="kit in kits" :key="kit._id">
                        <td>
                            <img
                                :src="kit.imagePath || '/img/default_product.png'"
                                alt="키트 이미지"
                                class="kitThumbnail"
                            />
                        </td>
                        <td>{{ kit.kitName }}</td>
                        <td>{{ kit.description || "-" }}</td>
                        <td>{{ kit.price.toLocaleString() }}원</td>
                        <td>{{ kit.originalPrice.toLocaleString() }}원</td>
                        <td>
                            <ul class="productList">
                                <li v-for="item in kit.products" :key="item.productId._id">
                                    {{ item.productId.koreanName }} ({{ item.quantity }}개)
                                </li>
                            </ul>
                        </td>
                        <td>
                            <button class="actionBtn edit" @click="editKit(kit)">수정</button>
                            <button class="actionBtn delete" @click="deleteKit(kit._id)">삭제</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <KitModal
                v-if="showModal"
                @close="handleModalClose"
                @refresh="fetchKits"
                @created="createKit"
                :editTarget="editTarget"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminService from "@/api/AdminService";
import KitModal from "@/components/admin/KitModal.vue";

const kits = ref([]);
const showModal = ref(false);
const editTarget = ref(null);
const token = localStorage.getItem("token");

const fetchKits = () => {
    AdminService.getKits(token)
        .then((res) => {
            kits.value = res.data;
        })
        .catch((err) => {
            console.error("❌ 키트 목록 불러오기 실패:", err);
        });
};

const editKit = (kit) => {
    editTarget.value = kit;
    showModal.value = true;
};

const createKit = () => {
    fetchKits();
};
const handleModalClose = () => {
    showModal.value = false;
    editTarget.value = null;
};
const deleteKit = (kitId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    AdminService.deleteKit(kitId, token)
        .then(() => {
            alert("키트가 삭제되었습니다.");
            fetchKits();
        })
        .catch((err) => {
            console.error("❌ 키트 삭제 실패:", err);
        });
};

onMounted(fetchKits);
</script>

<style scoped>
.adminPageWrapper {
    display: flex;
}

.adminContent {
    flex-grow: 1;
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.pageTitle {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

.addBtn {
    padding: 10px 16px;
    font-size: 14px;
    margin-bottom: 20px;
    border-radius: 6px;
    cursor: pointer;
    color: white;
    border: none;
}

.dataTable {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 32px;
}

.dataTable th,
.dataTable td {
    border: 1px solid #ccc;
    padding: 12px;
    text-align: center;
    vertical-align: top;
}
.kitInfo {
    display: flex;
    align-items: center;
    gap: 10px;
}

.kitThumbnail {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    object-fit: contain;
    border-radius: 6px;
    border: 1px solid #ddd;
}

.productList {
    padding-left: 18px;
    margin: 0;
}

.actionBtn {
    margin-right: 8px;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
}

.actionBtn.edit {
    background-color: #4caf50;
    color: white;
}

.actionBtn.delete {
    background-color: #f44336;
    color: white;
}
</style>
