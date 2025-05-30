<template>
    <div class="qnaPage">
        <h2 class="pageTitle">Q&A 게시판</h2>

        <!-- 카테고리 탭 -->
        <div class="categoryTabs">
            <button
                v-for="cat in categories"
                :key="cat"
                :class="['tabBtn', { active: selectedCategory === cat }]"
                @click="handleCategoryChange(cat)"
            >
                {{ cat }}
            </button>
        </div>

        <!-- 검색 필터 -->
        <div class="searchFilter">
            <select v-model="searchType">
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="title_content">제목+내용</option>
                <option value="author">작성자</option>
            </select>
            <input v-model="searchKeyword" type="text" placeholder="검색어 입력" />
            <button class="searchBtn" @click="handleSearch">검색</button>
        </div>

        <!-- Q&A 테이블 -->
        <table class="qnaTable">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>카테고리</th>
                    <th>상품</th>
                    <th>이미지</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in qnaList" :key="item._id">
                    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                    <td>{{ item.category }}</td>
                    <td>{{ item.productName }}</td>
                    <td>
                        <img :src="item.imagePath" alt="상품 이미지" class="qnaProductImg" />
                    </td>
                    <td>{{ item.title }}</td>
                    <td>{{ item.maskedAuthor }}</td>
                    <td>{{ formatDate(item.createdAt) }}</td>
                    <td>{{ item.views }}</td>
                </tr>
            </tbody>
        </table>

        <!-- 페이지네이션 -->
        <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import QnaService from "@/api/QnaService";
import Pagination from "@/components/common/Pagination.vue";

const categories = ["전체", "배송", "상품", "주문", "기타"];
const selectedCategory = ref("전체");
const qnaList = ref([]);
const searchType = ref("title");
const searchKeyword = ref("");
const currentPage = ref(1);
const pageSize = 1;
const totalPages = ref(1);
const token = localStorage.getItem("token");

const fetchQnAs = () => {
    const query = {
        category: selectedCategory.value === "전체" ? "" : selectedCategory.value,
        searchType: searchType.value,
        keyword: searchKeyword.value,
        page: currentPage.value,
        size: pageSize,
    };

    QnaService.getQnaList(query, token)
        .then((res) => {
            qnaList.value = res.data.qnas;
            totalPages.value = Math.ceil(res.data.total / pageSize);
        })
        .catch((err) => {
            console.error("❌ QnA 목록 불러오기 실패:", err);
        });
};

const handleCategoryChange = (cat) => {
    selectedCategory.value = cat;
    currentPage.value = 1;
    fetchQnAs();
};

const handleSearch = () => {
    currentPage.value = 1;
    fetchQnAs();
};

const handlePageChange = (page) => {
    currentPage.value = page;
    fetchQnAs();
};

const formatDate = (str) => {
    const d = new Date(str);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}`;
};

onMounted(fetchQnAs);
</script>
<style scoped>
.qnaPage {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
}
.pageTitle {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
}
.categoryTabs {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
}
.tabBtn {
    padding: 8px 16px;
    border: none;
    background-color: #e0d3e5;
    border-radius: 20px;
    cursor: pointer;
    color: #604b6e;
}
.tabBtn.active {
    background-color: #604b6e;
    color: white;
    font-weight: bold;
}
.searchFilter {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}
.searchFilter select,
.searchFilter input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
}
.searchBtn {
    background-color: #cc8a94;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
}
.searchBtn:hover {
    background-color: #ca717f;
}
.qnaTable {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}
.qnaTable th,
.qnaTable td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}
.thumbImg {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: 6px;
}
.qnaProductImg {
    width: 54px;
    height: 54px;
    object-fit: contain;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin: 0 auto;
}
</style>
