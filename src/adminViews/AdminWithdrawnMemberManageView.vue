<template>
  <section class="admin-data-page">
    <header class="admin-page-head"><div><p>MEMBERS</p><h1>탈퇴 회원 관리</h1><span>탈퇴 이력과 사유를 확인하고 필요한 계정을 복구합니다.</span></div><div class="admin-count"><strong>{{ totalCount.toLocaleString() }}</strong><span>명</span></div></header>
    <form class="admin-filter-card" @submit.prevent="searchUsers">
      <label><span>탈퇴 기간</span><div class="admin-date-range"><input v-model="fromDate" type="date" aria-label="탈퇴 시작일"><i>–</i><input v-model="toDate" type="date" aria-label="탈퇴 종료일"></div></label>
      <label><span>이름</span><input v-model.trim="searchName" placeholder="회원 이름"></label><label><span>회원번호</span><input v-model.trim="searchMemberId" placeholder="회원번호"></label>
      <div class="admin-filter-actions"><button type="button" class="admin-btn ghost" @click="resetFilters">초기화</button><button class="admin-btn primary" :disabled="loading"><i class="fa-solid fa-magnifying-glass"></i> 검색</button></div>
    </form>
    <div class="admin-notice"><i class="fa-solid fa-circle-info"></i><p><strong>계정 복구 전 확인해 주세요.</strong><span>복구하면 해당 회원이 다시 로그인할 수 있습니다. 본인 요청 여부를 확인한 뒤 처리하세요.</span></p></div>
    <div class="admin-table-card"><div class="admin-table-toolbar"><div><strong>탈퇴 회원 목록</strong><span>현재 조건의 탈퇴 회원 {{ totalCount.toLocaleString() }}명</span></div></div>
      <div v-if="error" class="admin-state error"><i class="fa-solid fa-circle-exclamation"></i><p>{{ error }}</p><button class="admin-btn ghost" @click="fetchUsers">다시 시도</button></div>
      <div v-else class="admin-table-scroll"><table class="admin-table"><thead><tr><th>회원</th><th>회원번호</th><th>연락처</th><th>생년월일</th><th>등급</th><th>추천인</th><th>탈퇴일</th><th>탈퇴 사유</th><th>관리</th></tr></thead><tbody>
        <tr v-if="loading"><td colspan="9"><div class="admin-state compact"><i class="fa-solid fa-spinner fa-spin"></i><p>탈퇴 회원을 불러오는 중입니다.</p></div></td></tr>
        <tr v-else-if="!users.length"><td colspan="9"><div class="admin-state compact"><i class="fa-regular fa-folder-open"></i><p>조건에 맞는 탈퇴 회원이 없습니다.</p></div></td></tr>
        <tr v-for="user in users" :key="user._id"><td><div class="admin-primary-cell"><strong>{{ user.fullName || '-' }}</strong></div></td><td class="mono">{{ user.memberId || '-' }}</td><td>{{ user.phone || '-' }}</td><td>{{ formatDate(user.birthday) }}</td><td><span class="admin-chip muted">{{ user.membershipLevel || '미지정' }}</span></td><td><div class="admin-primary-cell"><strong>{{ user.referrerName || '-' }}</strong><small>{{ user.referrerMemberId || '' }}</small></div></td><td>{{ formatDate(user.deletedAt) }}</td><td class="admin-reason">{{ user.deleteReason || '-' }}</td><td><button class="admin-btn small secondary" :disabled="restoringId === user._id" @click="restoreUser(user)">{{ restoringId === user._id ? '처리 중' : '회원 복구' }}</button></td></tr>
      </tbody></table></div>
    </div>
    <Pagination v-if="!loading && totalPages > 1" :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
  </section>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import AdminService from "@/api/AdminService";
import Pagination from "@/components/common/Pagination.vue";
import { getStoredToken } from "@/utils/storage";
const users=ref([]),totalCount=ref(0),currentPage=ref(1),loading=ref(false),error=ref(""),restoringId=ref("");
const fromDate=ref(""),toDate=ref(""),searchName=ref(""),searchMemberId=ref(""),pageSize=20;
const totalPages=computed(()=>Math.ceil(totalCount.value/pageSize));
const formatDate=value=>{if(!value)return "-";const date=new Date(value);return Number.isNaN(date.getTime())?"-":date.toLocaleDateString("ko-KR")};
async function fetchUsers(){loading.value=true;error.value="";try{const{data}=await AdminService.getWithdrawnUsers({name:searchName.value,memberId:searchMemberId.value,page:currentPage.value,size:pageSize,fromDate:fromDate.value||undefined,toDate:toDate.value||undefined},getStoredToken());users.value=data.users||[];totalCount.value=data.total||0}catch(err){console.error("탈퇴 회원 조회 실패:",err);users.value=[];totalCount.value=0;error.value="탈퇴 회원 정보를 불러오지 못했습니다."}finally{loading.value=false}}
function searchUsers(){currentPage.value=1;fetchUsers()} function handlePageChange(page){currentPage.value=page;fetchUsers()} function resetFilters(){fromDate.value="";toDate.value="";searchName.value="";searchMemberId.value="";searchUsers()}
async function restoreUser(user){if(!confirm(`${user.fullName||user.memberId} 회원을 복구하시겠습니까?`))return;restoringId.value=user._id;try{await AdminService.restoreUser(user._id,getStoredToken());alert("회원 복구가 완료되었습니다.");await fetchUsers()}catch(err){console.error("회원 복구 실패:",err);alert(err.response?.data?.message||"회원 복구 중 오류가 발생했습니다.")}finally{restoringId.value=""}}
onMounted(fetchUsers);
</script>
