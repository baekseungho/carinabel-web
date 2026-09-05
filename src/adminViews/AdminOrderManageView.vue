<template>
  <section class="admin-data-page">
    <header class="admin-page-head"><div><p>ORDERS</p><h1>주문 관리</h1><span>주문 내역을 조건별로 조회하고 자료를 내려받습니다.</span></div><div class="admin-count"><strong>{{ total.toLocaleString() }}</strong><span>건</span></div></header>
    <form class="admin-filter-card" @submit.prevent="fetchOrders(1)">
      <label><span>주문 기간</span><div class="admin-date-range"><input v-model="filters.fromDate" type="date" aria-label="주문 시작일"><i>–</i><input v-model="filters.toDate" type="date" aria-label="주문 종료일"></div></label>
      <label><span>주문번호</span><input v-model.trim="filters.orderNumber" placeholder="주문번호"></label><label><span>상품명</span><input v-model.trim="filters.productName" placeholder="상품명"></label><label><span>주문자</span><input v-model.trim="filters.name" placeholder="회원 이름"></label>
      <div class="admin-filter-actions"><button type="button" class="admin-btn ghost" @click="resetFilters">초기화</button><button class="admin-btn primary" :disabled="loading"><i class="fa-solid fa-magnifying-glass"></i> 검색</button></div>
    </form>
    <div class="admin-table-card"><div class="admin-table-toolbar"><div><strong>주문 목록</strong><span>현재 조건의 주문 {{ total.toLocaleString() }}건</span></div><div class="toolbar-actions"><button class="admin-btn ghost" :disabled="loading || !orders.length" @click="downloadCurrentPageOrders">현재 페이지</button><button class="admin-btn secondary" :disabled="loading || !total" @click="downloadAllOrders"><i class="fa-solid fa-file-arrow-down"></i> 전체 엑셀</button></div></div>
      <div v-if="error" class="admin-state error"><i class="fa-solid fa-circle-exclamation"></i><p>{{ error }}</p><button class="admin-btn ghost" @click="fetchOrders(currentPage)">다시 시도</button></div>
      <div v-else class="admin-table-scroll"><table class="admin-table"><thead><tr><th>주문번호</th><th>주문일시</th><th>주문자</th><th>상품</th><th>수량</th><th>결제금액</th><th>상태</th></tr></thead><tbody>
        <tr v-if="loading"><td colspan="7"><div class="admin-state compact"><i class="fa-solid fa-spinner fa-spin"></i><p>주문을 불러오는 중입니다.</p></div></td></tr>
        <tr v-else-if="!orders.length"><td colspan="7"><div class="admin-state compact"><i class="fa-regular fa-folder-open"></i><p>조건에 맞는 주문이 없습니다.</p></div></td></tr>
        <tr v-for="order in orders" :key="order._id"><td class="mono"><strong>{{ order.orderNumber || '-' }}</strong></td><td>{{ formatDate(order.createdAt) }}</td><td><div class="admin-primary-cell"><strong>{{ order.userId?.fullName || '탈퇴/비회원' }}</strong><small>{{ order.userId?.memberId || '-' }}</small></div></td><td class="admin-product">{{ order.productName || '-' }}</td><td>{{ order.quantity || 0 }}</td><td><strong>{{ formatCurrency(order.amount) }}</strong></td><td><span class="admin-status" :data-status="order.status">{{ order.status || '미지정' }}</span></td></tr>
      </tbody></table></div>
    </div>
    <Pagination v-if="!loading && totalPages > 1" :current-page="currentPage" :total-pages="totalPages" @page-change="fetchOrders" />
  </section>
</template>
<script setup>
import { onMounted, ref } from "vue";
import * as XLSX from "xlsx";
import AdminService from "@/api/AdminService";
import Pagination from "@/components/common/Pagination.vue";
import { getStoredToken } from "@/utils/storage";
const orders=ref([]),total=ref(0),currentPage=ref(1),totalPages=ref(1),loading=ref(false),error=ref(""),pageSize=20;
const filters=ref({productName:"",name:"",orderNumber:"",fromDate:"",toDate:""});
const formatDate=value=>{if(!value)return "-";const date=new Date(value);return Number.isNaN(date.getTime())?"-":date.toLocaleString("ko-KR")};
const formatCurrency=value=>`${Number(value||0).toLocaleString("ko-KR")}원`;
async function fetchOrders(page=1){currentPage.value=page;loading.value=true;error.value="";try{const{data}=await AdminService.getAllOrders(getStoredToken(),{page,size:pageSize,...filters.value});orders.value=data.orders||[];total.value=data.total||0;totalPages.value=Math.max(1,Math.ceil(total.value/pageSize))}catch(err){console.error("주문 조회 실패:",err);orders.value=[];total.value=0;error.value="주문 정보를 불러오지 못했습니다."}finally{loading.value=false}}
function resetFilters(){filters.value={productName:"",name:"",orderNumber:"",fromDate:"",toDate:""};fetchOrders(1)}
const excelRows=(items,offset=0)=>items.map((order,index)=>({번호:offset+index+1,주문번호:order.orderNumber||"-",주문일시:formatDate(order.createdAt),이름:order.userId?.fullName||"탈퇴/비회원",회원번호:order.userId?.memberId||"-",상품명:order.productName||"-",수량:order.quantity||0,가격:Number(order.amount||0),상태:order.status||"-"}));
function saveExcel(rows,name){if(!rows.length)return alert("다운로드할 주문이 없습니다.");const book=XLSX.utils.book_new();XLSX.utils.book_append_sheet(book,XLSX.utils.json_to_sheet(rows),"주문목록");XLSX.writeFile(book,`${name}_${new Date().toISOString().slice(0,10)}.xlsx`)}
function downloadCurrentPageOrders(){saveExcel(excelRows(orders.value,(currentPage.value-1)*pageSize),`주문목록_${currentPage.value}페이지`)}
async function downloadAllOrders(){try{const{data}=await AdminService.getAllOrders(getStoredToken(),{page:1,size:10000,...filters.value});saveExcel(excelRows(data.orders||[]),"전체주문목록")}catch(err){console.error("전체 주문 다운로드 실패:",err);alert("엑셀 파일을 만들지 못했습니다.")}}
onMounted(()=>fetchOrders());
</script>
