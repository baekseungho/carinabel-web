<template>
  <section class="admin-data-page">
    <header class="admin-page-head"><div><p>CANCELLATIONS</p><h1>주문 취소 관리</h1><span>취소 요청을 확인하고 결제 거래번호를 검증해 처리합니다.</span></div><div class="admin-count warning"><strong>{{ orders.length.toLocaleString() }}</strong><span>대기</span></div></header>
    <div class="admin-notice danger"><i class="fa-solid fa-triangle-exclamation"></i><p><strong>취소 처리는 되돌릴 수 없습니다.</strong><span>주문번호, 결제금액과 PG 거래번호(TRXID)가 일치하는지 반드시 확인하세요.</span></p></div>
    <div class="admin-table-card"><div class="admin-table-toolbar"><div><strong>취소 대기 주문</strong><span>처리 전 취소 사유와 결제 정보를 확인하세요.</span></div><button class="admin-btn ghost" :disabled="loading" @click="fetchOrders"><i class="fa-solid fa-rotate"></i> 새로고침</button></div>
      <div v-if="error" class="admin-state error"><i class="fa-solid fa-circle-exclamation"></i><p>{{ error }}</p><button class="admin-btn ghost" @click="fetchOrders">다시 시도</button></div>
      <div v-else class="admin-table-scroll"><table class="admin-table"><thead><tr><th>주문번호</th><th>상품</th><th>금액</th><th>취소 사유</th><th>PG 거래번호</th><th>처리</th></tr></thead><tbody>
        <tr v-if="loading"><td colspan="6"><div class="admin-state compact"><i class="fa-solid fa-spinner fa-spin"></i><p>취소 요청을 불러오는 중입니다.</p></div></td></tr>
        <tr v-else-if="!orders.length"><td colspan="6"><div class="admin-state compact success"><i class="fa-regular fa-circle-check"></i><p>현재 취소 대기 주문이 없습니다.</p></div></td></tr>
        <tr v-for="order in orders" :key="order._id"><td class="mono"><strong>{{ order.orderNumber || '-' }}</strong></td><td class="admin-product">{{ order.productName || '-' }}</td><td><strong>{{ formatPrice(order.amount) }}</strong></td><td class="admin-reason">{{ order.reason || '사유 미입력' }}</td><td><input v-model.trim="trxIds[order._id]" class="trx-input" placeholder="TRXID 입력" :aria-label="`${order.orderNumber} 거래번호`" @keyup.enter="cancelOrder(order)"></td><td><button class="admin-btn small danger" :disabled="processingId === order._id || !trxIds[order._id]" @click="cancelOrder(order)">{{ processingId === order._id ? '처리 중' : '취소 승인' }}</button></td></tr>
      </tbody></table></div>
    </div>
  </section>
</template>
<script setup>
import { onMounted, ref } from "vue";
import AdminService from "@/api/AdminService";
import { getStoredToken } from "@/utils/storage";
const orders=ref([]),trxIds=ref({}),loading=ref(false),error=ref(""),processingId=ref("");
const formatPrice=value=>`${Number(value||0).toLocaleString("ko-KR")}원`;
async function fetchOrders(){loading.value=true;error.value="";try{const{data}=await AdminService.getPendingCancelOrders(getStoredToken());orders.value=Array.isArray(data)?data:(data.orders||[])}catch(err){console.error("취소 대기 주문 조회 실패:",err);orders.value=[];error.value="취소 요청을 불러오지 못했습니다."}finally{loading.value=false}}
async function cancelOrder(order){const trxId=trxIds.value[order._id]?.trim();if(!trxId)return alert("PG 거래번호(TRXID)를 입력해 주세요.");if(!order.orderNumber)return alert("주문번호가 없어 취소를 처리할 수 없습니다.");if(!confirm(`${order.orderNumber} 주문의 ${formatPrice(order.amount)} 결제를 취소하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`))return;processingId.value=order._id;try{await AdminService.cancelOrderAsAdmin(order.orderNumber,{trxId,amount:Number(order.amount||0),reason:order.reason||"관리자 승인 취소"},getStoredToken());alert("주문 취소가 완료되었습니다.");delete trxIds.value[order._id];await fetchOrders()}catch(err){console.error("주문 취소 처리 실패:",err);alert(err.response?.data?.message||"주문 취소 처리에 실패했습니다.")}finally{processingId.value=""}}
onMounted(fetchOrders);
</script>
