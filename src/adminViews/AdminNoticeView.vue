<template>
    <div class="adminNoticeList">
        <h1 class="pageTitle">공지사항 관리</h1>

        <!-- 🔹 공지사항 작성 폼 -->
        <div class="noticeForm">
            <h3>{{ isEditing ? "공지사항 수정" : "공지사항 작성" }}</h3>
            <input v-model="form.title" placeholder="제목을 입력하세요" />
            <textarea
                v-model="form.summary"
                placeholder="요약 내용을 입력하세요"
            ></textarea>
            <textarea
                v-model="form.content"
                placeholder="본문 내용을 입력하세요"
                rows="6"
            ></textarea>
            <input type="date" v-model="form.date" />
            <div class="formActions">
                <button @click="submitNotice" class="themaBgColor4">
                    {{ isEditing ? "수정 완료" : "공지 등록" }}
                </button>
                <button v-if="isEditing" @click="cancelEdit" class="cancelBtn">
                    취소
                </button>
            </div>
        </div>

        <!-- 🔹 공지사항 목록 -->
        <table class="noticeTable">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성일</th>
                    <th>관리</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(notice, index) in noticeList" :key="notice._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ notice.title }}</td>
                    <td>{{ notice.date }}</td>
                    <td>
                        <button @click="editNotice(notice)">수정</button>
                        <button @click="deleteNotice(notice._id)">삭제</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import NoticeService from "@/api/NoticeService";

const store = useStore();
const token = store.state.token.token;

const noticeList = ref([]);
const form = ref({
    _id: null,
    title: "",
    summary: "",
    content: "",
    date: "",
});
const isEditing = ref(false);

// 📌 공지 목록 조회
const fetchNotices = () => {
    NoticeService.getNoticeList({}, token)
        .then((res) => {
            noticeList.value = res.data.notices;
        })
        .catch((err) => {
            console.error("❌ 공지 목록 조회 실패:", err);
        });
};

// ➕ 등록 또는 ✏️ 수정
const submitNotice = () => {
    if (!form.value.title || !form.value.content || !form.value.date) {
        alert("제목, 본문, 날짜는 필수입니다.");
        return;
    }

    const payload = {
        title: form.value.title,
        summary: form.value.summary,
        content: form.value.content,
        date: form.value.date,
    };

    if (isEditing.value) {
        NoticeService.updateNotice(form.value._id, payload, token)
            .then(() => {
                alert("공지사항이 수정되었습니다.");
                resetForm();
                fetchNotices();
            })
            .catch((err) => {
                console.error("❌ 공지 수정 실패:", err);
            });
    } else {
        NoticeService.createNotice(payload, token)
            .then(() => {
                alert("공지사항이 등록되었습니다.");
                resetForm();
                fetchNotices();
            })
            .catch((err) => {
                console.error("❌ 공지 등록 실패:", err);
            });
    }
};

// ✏️ 수정 모드 진입
const editNotice = (notice) => {
    form.value = { ...notice };
    isEditing.value = true;
};

// ❌ 수정 취소
const cancelEdit = () => {
    resetForm();
};

// 🧹 폼 초기화
const resetForm = () => {
    form.value = {
        _id: null,
        title: "",
        summary: "",
        content: "",
        date: "",
    };
    isEditing.value = false;
};

// ❌ 삭제
const deleteNotice = (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    NoticeService.deleteNotice(id, token)
        .then(() => {
            alert("공지사항이 삭제되었습니다.");
            fetchNotices();
        })
        .catch((err) => {
            console.error("❌ 공지 삭제 실패:", err);
        });
};

onMounted(() => {
    fetchNotices();
});
</script>

<style scoped>
.adminNoticeList {
    padding: 2rem;
    margin-left: 220px;
}

.pageTitle {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
}

.noticeForm {
    background-color: #fff;
    padding: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
}

.noticeForm input,
.noticeForm textarea {
    width: 100%;
    margin-bottom: 12px;
    padding: 10px;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
}

.formActions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.formActions button {
    padding: 8px 18px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    border: none;
}

.themaBgColor4 {
    background-color: #cc8a94;
    color: white;
}

.cancelBtn {
    background-color: #ddd;
    color: #444;
}

.noticeTable {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
}

.noticeTable th,
.noticeTable td {
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    text-align: center;
    font-size: 0.95rem;
}

.noticeTable th {
    background-color: #f2f2f2;
    color: #333;
    font-weight: 600;
}

.noticeTable button {
    padding: 6px 12px;
    margin: 0 4px;
    font-size: 13px;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    background-color: #cc8a94;
    color: white;
}

.noticeTable button:hover {
    background-color: #a0666f;
}
</style>
