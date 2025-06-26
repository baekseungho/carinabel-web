<template>
    <div class="addressPage">
        <div class="addressHeader">
            <h2>배송지 관리</h2>
            <button class="addBtn" @click="openModal()">+ 배송지 추가</button>
        </div>

        <div class="addressTableWrapper" v-if="addresses.length">
            <table class="addressTable">
                <thead>
                    <tr>
                        <th>받는사람</th>
                        <th>전화번호</th>
                        <th>휴대폰</th>
                        <th>주소</th>
                        <th>기본</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in addresses" :key="item._id">
                        <td>{{ item.recipientName }}</td>
                        <td>{{ item.phone || "-" }}</td>
                        <td>{{ item.mobile }}</td>
                        <td>{{ item.address }}</td>
                        <td>{{ item.isDefault ? "✔️" : "" }}</td>
                        <td>
                            <button class="editBtn" @click="openModal(item)">수정</button>
                            <button class="deleteBtn" @click="deleteAddress(item._id)">삭제</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p v-else class="noData">등록된 배송지가 없습니다.</p>

        <AddressModal v-if="modalVisible" :address="selectedAddress" @close="modalVisible = false" @saved="onSaved" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AddressModal from "@/components/myPage/AddressModal.vue";
import AddressService from "@/api/AddressService";

const addresses = ref([]);
const modalVisible = ref(false);
const selectedAddress = ref(null);
const token = localStorage.getItem("token");

const fetchAddresses = () => {
    AddressService.getAddressList(token).then((res) => {
        addresses.value = res.data;
    });
};

const openModal = (item = null) => {
    selectedAddress.value = item;
    modalVisible.value = true;
};

const deleteAddress = (id) => {
    if (confirm("정말 삭제하시겠습니까?")) {
        AddressService.deleteAddress(id, token).then(() => fetchAddresses());
    }
};

const onSaved = () => {
    modalVisible.value = false;
    fetchAddresses();
};

onMounted(fetchAddresses);
</script>

<style scoped>
.addressPage {
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.5s ease;
}
.addressHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}
.addressHeader h2 {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
}
.addBtn {
    padding: 10px 20px;
    background-color: #cc8a94;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}
.addBtn:hover {
    background-color: #ca717f;
}

.addressTable {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
    border-radius: 12px;

    overflow: hidden;
}
.addressTableWrapper {
    overflow-x: auto;
}
.addressTableWrapper::-webkit-scrollbar {
    height: 6px;
    cursor: pointer;
}
.addressTableWrapper::-webkit-scrollbar-thumb {
    background-color: #cc8a94;
    border-radius: 3px;
    cursor: pointer;
}
.addressTable th,
.addressTable td {
    padding: 14px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}
.editBtn,
.deleteBtn {
    padding: 6px 12px;
    margin: 0 4px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}
.editBtn {
    background: #604b6e; /* 왕족 테마 */
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}
.editBtn:hover {
    background: #503d5b; /* 약간 어두운 톤 */
}

.deleteBtn {
    background: #e57373;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}
.deleteBtn:hover {
    background: #cc5c5c;
}
.noData {
    text-align: center;
    color: #777;
}

thead {
    background-color: #333;
    color: #fff;
}

@media (max-width: 1200px) {
    .addressPage {
        padding: 16px 20px;
        border-radius: 12px;
    }

    .addressHeader h2 {
        font-size: 24px;
        margin-bottom: 4px;
    }

    .addBtn {
        font-size: 15px;
        padding: 8px 16px;
    }
    .addressTable {
        min-width: 640px;
    }
    .addressTable th,
    .addressTable td {
        font-size: 15px;
        padding: 10px 8px;
    }

    .editBtn,
    .deleteBtn {
        font-size: 14px;
        padding: 5px 10px;
    }
}
/* ✅ 900px 이하: 중간 크기 대응 (태블릿 세로, 작은 노트북 등) */
@media (max-width: 900px) {
    .addressPage {
        padding: 14px 16px;
    }

    .addressHeader h2 {
        font-size: 22px;
    }

    .addBtn {
        font-size: 14px;
        padding: 8px 12px;
    }

    .addressTable th,
    .addressTable td {
        font-size: 14px;
        padding: 8px 6px;
    }

    .editBtn,
    .deleteBtn {
        font-size: 13px;
        padding: 5px 8px;
    }
}
@media (max-width: 600px) {
    .addressPage {
        padding: 12px 10px;
    }

    .addressHeader {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .addressHeader h2 {
        font-size: 20px;
    }

    .addBtn {
        width: 100%;
        font-size: 14px;
        padding: 10px 0;
    }

    .addressTable {
        overflow-x: auto;
        display: block;
    }

    .addressTable table {
        min-width: 800px;
        width: 100%;
    }

    .addressTable th,
    .addressTable td {
        font-size: 13.5px;
        padding: 8px 6px;
    }

    .editBtn,
    .deleteBtn {
        font-size: 13px;
        padding: 5px 8px;
    }
}
</style>
