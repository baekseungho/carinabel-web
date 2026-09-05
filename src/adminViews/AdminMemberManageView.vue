<template>
  <section class="admin-data-page">
    <header class="admin-page-head">
      <div><p>MEMBERS</p><h1>회원 관리</h1><span>가입 회원을 검색하고 회원 정보를 확인합니다.</span></div>
      <div class="admin-count"><strong>{{ totalCount.toLocaleString() }}</strong><span>명</span></div>
    </header>

    <form class="admin-filter-card" @submit.prevent="searchUsers">
      <label><span>가입 기간</span><div class="admin-date-range"><input v-model="fromDate" type="date" aria-label="가입 시작일"><i>–</i><input v-model="toDate" type="date" aria-label="가입 종료일"></div></label>
      <label><span>이름</span><input v-model.trim="searchName" placeholder="회원 이름"></label>
      <label><span>회원번호</span><input v-model.trim="searchMemberId" placeholder="회원번호"></label>
      <label><span>회원 등급</span><select v-model="selectedLevel"><option value="">전체 등급</option><option>일반회원</option><option>회원</option><option>대리점</option><option>총판</option></select></label>
      <div class="admin-filter-actions"><button type="button" class="admin-btn ghost" @click="resetFilters">초기화</button><button class="admin-btn primary" :disabled="loading"><i class="fa-solid fa-magnifying-glass"></i> 검색</button></div>
    </form>

    <div class="admin-table-card">
      <div class="admin-table-toolbar"><div><strong>회원 목록</strong><span>현재 조건의 회원 {{ totalCount.toLocaleString() }}명</span></div><button class="admin-btn secondary" :disabled="loading || !totalCount" @click="downloadExcel"><i class="fa-solid fa-file-arrow-down"></i> 엑셀 다운로드</button></div>
      <div v-if="error" class="admin-state error"><i class="fa-solid fa-circle-exclamation"></i><p>{{ error }}</p><button class="admin-btn ghost" @click="fetchUsers">다시 시도</button></div>
      <div v-else class="admin-table-scroll">
        <table class="admin-table">
          <thead><tr><th>회원</th><th>회원번호</th><th>연락처</th><th>생년월일</th><th>등급</th><th>추천인</th><th>주소</th><th>가입일</th></tr></thead>
          <tbody>
            <tr v-if="loading"><td colspan="8"><div class="admin-state compact"><i class="fa-solid fa-spinner fa-spin"></i><p>회원 정보를 불러오는 중입니다.</p></div></td></tr>
            <tr v-else-if="!users.length"><td colspan="8"><div class="admin-state compact"><i class="fa-regular fa-folder-open"></i><p>조건에 맞는 회원이 없습니다.</p></div></td></tr>
            <tr v-for="user in users" :key="user._id">
              <td><div class="admin-primary-cell"><strong>{{ user.fullName || '-' }}</strong><small>{{ user.role === 'admin' ? '관리자' : '회원' }}</small></div></td>
              <td class="mono">{{ user.memberId || '-' }}</td><td>{{ user.phone || '-' }}</td><td>{{ formatDate(user.birthday) }}</td>
              <td><span class="admin-chip">{{ user.membershipLevel || '미지정' }}</span></td>
              <td><div class="admin-primary-cell"><strong>{{ user.referrerName || '-' }}</strong><small>{{ user.referrerMemberId || '' }}</small></div></td>
              <td class="admin-address">{{ user.address || '-' }}</td><td>{{ formatDate(user.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Pagination v-if="!loading && totalPages > 1" :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import * as XLSX from "xlsx";
import AdminService from "@/api/AdminService";
import Pagination from "@/components/common/Pagination.vue";
import { getStoredToken } from "@/utils/storage";

const users = ref([]), totalCount = ref(0), currentPage = ref(1), loading = ref(false), error = ref("");
const fromDate = ref(""), toDate = ref(""), searchName = ref(""), searchMemberId = ref(""), selectedLevel = ref("");
const pageSize = 20;
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));
const formatDate = value => { if (!value) return "-"; const date = new Date(value); return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("ko-KR"); };
const params = (page = currentPage.value, size = pageSize) => ({ name: searchName.value, memberId: searchMemberId.value, level: selectedLevel.value, page, size, fromDate: fromDate.value || undefined, toDate: toDate.value || undefined });

async function fetchUsers() {
  loading.value = true; error.value = "";
  try { const { data } = await AdminService.getFilteredUsers(params(), getStoredToken()); users.value = data.users || []; totalCount.value = data.total || 0; }
  catch (err) { console.error("회원 목록 조회 실패:", err); users.value = []; totalCount.value = 0; error.value = "회원 정보를 불러오지 못했습니다."; }
  finally { loading.value = false; }
}
function searchUsers() { currentPage.value = 1; fetchUsers(); }
function handlePageChange(page) { currentPage.value = page; fetchUsers(); }
function resetFilters() { fromDate.value = ""; toDate.value = ""; searchName.value = ""; searchMemberId.value = ""; selectedLevel.value = ""; searchUsers(); }
async function downloadExcel() {
  try {
    const { data: response } = await AdminService.getFilteredUsers(params(1, 10000), getStoredToken());
    const rows = (response.users || []).map((user, index) => ({ 번호: index + 1, 이름: user.fullName, 회원번호: user.memberId, 전화번호: user.phone, 생년월일: formatDate(user.birthday), 회원등급: user.membershipLevel, 추천인이름: user.referrerName || "-", 추천인회원번호: user.referrerMemberId || "-", 주소: user.address || "-", 가입일: formatDate(user.createdAt) }));
    if (!rows.length) return alert("다운로드할 회원이 없습니다.");
    const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(rows), "회원목록"); XLSX.writeFile(book, `회원목록_${new Date().toISOString().slice(0, 10)}.xlsx`);
  } catch (err) { console.error("회원 엑셀 다운로드 실패:", err); alert("엑셀 파일을 만들지 못했습니다."); }
}
onMounted(fetchUsers);
</script>
