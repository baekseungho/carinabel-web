<template>
  <section class="admin-data-page">
    <header class="admin-page-head"><div><p>FULFILLMENT</p><h1>배송 관리</h1><span>주문 진행 상태를 확인하고 개별 또는 일괄 변경합니다.</span></div><div class="admin-count"><strong>{{ orders.length.toLocaleString() }}</strong><span>건</span></div></header>
    <form class="admin-filter-card" @submit.prevent="fetchOrders">
      <label><span>회원 이름</span><input v-model.trim="searchName" placeholder="주문자 이름"></label><label><span>주문번호</span><input v-model.trim="searchOrderNumber" placeholder="주문번호"></label><label><span>주문 상태</span><select v-model="searchStatus"><option value="">전체 상태</option><option v-for="status in statusOptions" :key="status">{{ status }}</option></select></label>
      <div class="admin-filter-actions"><button type="button" class="admin-btn ghost" @click="resetFilters">초기화</button><button class="admin-btn primary" :disabled="loading"><i class="fa-solid fa-magnifying-glass"></i> 검색</button></div>
    </form>
    <div class="admin-table-card">
      <div class="admin-table-toolbar"><div><strong>배송 대상 주문</strong><span>{{ selectedOrders.length ? `${selectedOrders.length}건 선택됨` : '상태를 변경할 주문을 선택하세요.' }}</span></div><div class="admin-bulk"><select v-model="bulkStatus" aria-label="일괄 변경 상태"><option disabled value="">변경할 상태</option><option v-for="status in statusOptions" :key="status">{{ status }}</option></select><button class="admin-btn secondary" :disabled="!selectedOrders.length || !bulkStatus || bulkUpdating" @click="updateMultipleStatus">{{ bulkUpdating ? '변경 중' : '선택 항목 일괄 변경' }}</button></div></div>
      <div v-if="error" class="admin-state error"><i class="fa-solid fa-circle-exclamation"></i><p>{{ error }}</p><button class="admin-btn ghost" @click="fetchOrders">다시 시도</button></div>
      <div v-else class="admin-table-scroll"><table class="admin-table"><thead><tr><th class="check"><input v-model="selectAll" type="checkbox" aria-label="전체 주문 선택" @change="toggleAll"></th><th>주문번호</th><th>회원</th><th>상품</th><th>수량</th><th>결제금액</th><th>주문일</th><th>현재 상태</th><th>상태 변경</th></tr></thead><tbody>
        <tr v-if="loading"><td colspan="9"><div class="admin-state compact"><i class="fa-solid fa-spinner fa-spin"></i><p>배송 정보를 불러오는 중입니다.</p></div></td></tr>
        <tr v-else-if="!orders.length"><td colspan="9"><div class="admin-state compact"><i class="fa-regular fa-folder-open"></i><p>조건에 맞는 주문이 없습니다.</p></div></td></tr>
        <tr v-for="order in orders" :key="order._id"><td class="check"><input v-model="selectedOrders" type="checkbox" :value="order._id" :aria-label="`${order.orderNumber} 선택`"></td><td class="mono"><strong>{{ order.orderNumber || '-' }}</strong></td><td>{{ order.userId?.fullName || '탈퇴/비회원' }}</td><td class="admin-product">{{ order.productName || '-' }}</td><td>{{ order.quantity || 0 }}</td><td>{{ formatPrice(order.amount) }}</td><td>{{ formatDate(order.createdAt) }}</td><td><span class="admin-status" :data-status="order.status">{{ order.status || '미지정' }}</span></td><td><div class="admin-inline-control"><select v-model="pendingStatuses[order._id]" :aria-label="`${order.orderNumber} 상태`"><option v-for="status in statusOptions" :key="status">{{ status }}</option></select><button class="admin-btn small ghost" :disabled="updatingId === order._id || pendingStatuses[order._id] === order.status" @click="updateStatus(order)">{{ updatingId === order._id ? '변경 중' : '적용' }}</button></div></td></tr>
      </tbody></table></div>
    </div>
  </section>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import AdminService from "@/api/AdminService";
import { getStoredToken } from "@/utils/storage";
const orders=ref([]),searchName=ref(""),searchOrderNumber=ref(""),searchStatus=ref(""),selectedOrders=ref([]),selectAll=ref(false),pendingStatuses=ref({}),bulkStatus=ref(""),loading=ref(false),error=ref(""),updatingId=ref(""),bulkUpdating=ref(false);
const statusOptions=["입금대기","결제완료","상품준비중","배송중","배송완료","구매확정","취소중","반품중"];
watch(selectedOrders,value=>{selectAll.value=orders.value.length>0&&value.length===orders.value.length},{deep:true});
function toggleAll(){selectedOrders.value=selectAll.value?orders.value.map(order=>order._id):[]}
async function fetchOrders(){loading.value=true;error.value="";selectedOrders.value=[];selectAll.value=false;try{const{data}=await AdminService.getAdminOrders({name:searchName.value,orderNumber:searchOrderNumber.value,status:searchStatus.value},getStoredToken());orders.value=Array.isArray(data)?data:(data.orders||[]);pendingStatuses.value=Object.fromEntries(orders.value.map(order=>[order._id,order.status]))}catch(err){console.error("배송 주문 조회 실패:",err);orders.value=[];error.value="배송 정보를 불러오지 못했습니다."}finally{loading.value=false}}
function resetFilters(){searchName.value="";searchOrderNumber.value="";searchStatus.value="";fetchOrders()}
async function updateStatus(order){const status=pendingStatuses.value[order._id];if(!status||status===order.status)return;updatingId.value=order._id;try{await AdminService.updateOrderStatus(order._id,status,getStoredToken());order.status=status}catch(err){console.error("주문 상태 변경 실패:",err);alert(err.response?.data?.message||"주문 상태를 변경하지 못했습니다.")}finally{updatingId.value=""}}
async function updateMultipleStatus(){if(!selectedOrders.value.length||!bulkStatus.value)return;if(!confirm(`선택한 ${selectedOrders.value.length}건을 '${bulkStatus.value}' 상태로 변경하시겠습니까?`))return;bulkUpdating.value=true;try{await Promise.all(selectedOrders.value.map(id=>AdminService.updateOrderStatus(id,bulkStatus.value,getStoredToken())));await fetchOrders();bulkStatus.value=""}catch(err){console.error("주문 상태 일괄 변경 실패:",err);alert("일부 주문 상태를 변경하지 못했습니다. 목록을 새로 확인해 주세요.");await fetchOrders()}finally{bulkUpdating.value=false}}
const formatPrice=value=>`${Number(value||0).toLocaleString("ko-KR")}원`;const formatDate=value=>{if(!value)return "-";const date=new Date(value);return Number.isNaN(date.getTime())?"-":date.toLocaleDateString("ko-KR")};
onMounted(fetchOrders);
</script>
