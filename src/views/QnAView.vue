<template>
    <div class="qnaPage">
        <h2 class="pageTitle themaColor3">Q&A 게시판</h2>

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
        <div class="tableWrapper">
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
                <tbody v-if="qnaList.length > 0">
                    <tr
                        v-for="(item, index) in qnaList"
                        :key="item._id"
                        @click="goToDetail(item._id)"
                        class="clickableRow"
                    >
                        <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                        <td>{{ item.category }}</td>
                        <td>{{ item.productName }}</td>
                        <td>
                            <img :src="item.imagePath" alt="상품 이미지" class="qnaProductImg" />
                        </td>
                        <td>
                            <span v-if="item.hasAnswer" class="answeredTag"> [답변완료] </span>
                            {{ item.title }}
                        </td>
                        <td>{{ item.maskedAuthor }}</td>
                        <td>{{ formatDate(item.createdAt) }}</td>
                        <td>{{ item.views }}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 20px">등록된 글이 없습니다.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 페이지네이션 -->
        <Pagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
        />
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import QnaService from "@/api/QnaService";
import Pagination from "@/components/common/Pagination.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const categories = ["전체", "결제", "배송", "상품", "주문", "기타"];
const selectedCategory = ref("전체");
const qnaList = ref([]);
const searchType = ref("title");
const searchKeyword = ref("");
const currentPage = ref(1);
const pageSize = 5;
const totalPages = ref(1);
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user")); // ← 사용자 정보 불러오기

const fetchQnAs = () => {
    if (!user?._id || !token) {
        qnaList.value = [];
        totalPages.value = 1;
        return;
    }

    const query = {
        userId: user._id, // ✅ 로그인된 사용자만 요청
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
            qnaList.value = [];
            totalPages.value = 1;
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

const goToDetail = (id) => {
    router.push({ params: { id: id }, name: "QnADetail" });
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
    background-color: #fefefe;
}
.pageTitle {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 28px;
    border-bottom: 2px solid #cc8a94;
    padding-bottom: 12px;
}
.categoryTabs {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
}
.tabBtn {
    padding: 10px 20px;
    border: none;
    background-color: #f0e4ef;
    border-radius: 20px;
    cursor: pointer;
    color: #604b6e;
    font-weight: 500;
    transition: all 0.3s;
}
.tabBtn.active {
    background-color: #604b6e;
    color: #fff;
    font-weight: bold;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.searchFilter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    background-color: #fafafa;
    padding: 16px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.searchFilter select,
.searchFilter input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
}
.searchBtn {
    background-color: #cc8a94;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
}
.searchBtn:hover {
    background-color: #ca717f;
}
.tableWrapper {
    overflow-x: auto;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    background-color: #fff;
}
.qnaTable {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    min-width: 900px;
}
.qnaTable th {
    background-color: #857496;
    color: #fff;
    padding: 12px;
    font-weight: 600;
}
.qnaTable td {
    border: 1px solid #eee;
    padding: 12px;
    text-align: center;
    color: #333;
}
.qnaProductImg {
    width: 54px;
    height: 54px;
    object-fit: contain;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin: 0 auto;
}
.clickableRow {
    cursor: pointer;
    transition: background-color 0.2s;
}
.clickableRow:hover {
    background-color: #faf0f3;
}
.answeredTag {
    color: #4caf50;
    font-weight: bold;
    margin-right: 6px;
}
</style>
