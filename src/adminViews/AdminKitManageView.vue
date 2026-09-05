<template>
  <section class="admin-data-page">
    <header class="admin-page-head"><div><p>CATALOG</p><h1>키트 관리</h1><span>여러 상품을 묶어 큐레이션 키트를 구성하고 판매가를 관리합니다.</span></div><button class="admin-btn primary" @click="openCreate"><i class="fa-solid fa-plus"></i> 새 키트 등록</button></header>
    <div class="admin-table-card"><div class="admin-table-toolbar"><div><strong>키트 목록</strong><span>총 {{ kits.length }}개의 키트가 등록되어 있습니다.</span></div><label class="kit-search"><i class="fa-solid fa-magnifying-glass"></i><input v-model.trim="keyword" type="search" placeholder="키트명 검색"></label></div>
      <div v-if="error" class="admin-state error"><i class="fa-solid fa-circle-exclamation"></i><p>{{ error }}</p><button class="admin-btn ghost" @click="fetchKits">다시 시도</button></div>
      <div v-else class="admin-table-scroll"><table class="admin-table"><thead><tr><th>키트</th><th>설명</th><th>키트 판매가</th><th>구성 정상가</th><th>할인</th><th>구성 상품</th><th>관리</th></tr></thead><tbody>
        <tr v-if="loading"><td colspan="7"><div class="admin-state compact"><i class="fa-solid fa-spinner fa-spin"></i><p>키트를 불러오는 중입니다.</p></div></td></tr><tr v-else-if="!filteredKits.length"><td colspan="7"><div class="admin-state compact"><i class="fa-regular fa-folder-open"></i><p>등록된 키트가 없습니다.</p></div></td></tr>
        <tr v-for="kit in filteredKits" :key="kit._id"><td><div class="admin-product-cell"><img :src="kit.imagePath||fallbackImage" :alt="kit.kitName" @error="handleImageError"><strong>{{ kit.kitName||'-' }}</strong></div></td><td class="kit-description">{{ kit.description||'-' }}</td><td><strong>{{ formatPrice(kit.price) }}</strong></td><td>{{ formatPrice(kit.originalPrice) }}</td><td><span class="admin-chip">{{ discountRate(kit) }}% 할인</span></td><td><div class="kit-products"><span v-for="(item,index) in kit.products||[]" :key="item.productId?._id||item.productId||index">{{ item.productId?.koreanName||'상품 정보 없음' }} × {{ item.quantity }}</span><small v-if="!kit.products?.length">구성 없음</small></div></td><td><div class="row-actions"><button class="admin-btn small ghost" @click="editKit(kit)">수정</button><button class="admin-btn small danger" :disabled="deletingId===kit._id" @click="deleteKit(kit)">{{ deletingId===kit._id?'삭제 중':'삭제' }}</button></div></td></tr>
      </tbody></table></div>
    </div>
    <KitModal v-if="showModal" :edit-target="editTarget" @close="handleModalClose" @created="handleSaved" />
  </section>
</template>
<script setup>
import { computed,onMounted,ref } from "vue";import AdminService from "@/api/AdminService";import KitModal from "@/components/admin/KitModal.vue";import { getStoredToken } from "@/utils/storage";
const fallbackImage="/img/defalut_product.png";const kits=ref([]),showModal=ref(false),editTarget=ref(null),keyword=ref(""),loading=ref(false),error=ref(""),deletingId=ref("");
const filteredKits=computed(()=>kits.value.filter(kit=>(kit.kitName||"").toLowerCase().includes(keyword.value.toLowerCase())));const formatPrice=value=>`${Number(value||0).toLocaleString("ko-KR")}원`;const discountRate=kit=>Number(kit.originalPrice)>Number(kit.price)?Math.round((1-Number(kit.price)/Number(kit.originalPrice))*100):0;const handleImageError=event=>{event.target.onerror=null;event.target.src=fallbackImage};
async function fetchKits(){loading.value=true;error.value="";try{const{data}=await AdminService.getKits(getStoredToken());kits.value=Array.isArray(data)?data:[]}catch(err){console.error("키트 목록 조회 실패:",err);kits.value=[];error.value="키트 목록을 불러오지 못했습니다."}finally{loading.value=false}}
function openCreate(){editTarget.value=null;showModal.value=true}function editKit(kit){editTarget.value=kit;showModal.value=true}function handleModalClose(){showModal.value=false;editTarget.value=null}async function handleSaved(){handleModalClose();await fetchKits()}
async function deleteKit(kit){if(!confirm(`'${kit.kitName}' 키트를 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.`))return;deletingId.value=kit._id;try{await AdminService.deleteKit(kit._id,getStoredToken());alert("키트가 삭제되었습니다.");await fetchKits()}catch(err){console.error("키트 삭제 실패:",err);alert(err.response?.data?.message||"키트를 삭제하지 못했습니다.")}finally{deletingId.value=""}}
onMounted(fetchKits);
</script>
<style scoped>
.kit-search{height:39px;display:flex;align-items:center;gap:8px;padding:0 11px;border:1px solid #ddd4d1}.kit-search input{width:180px;border:0;outline:0;font-size:.7rem}.kit-search i{color:#9b9094}.admin-product-cell{display:flex;align-items:center;gap:11px;min-width:170px}.admin-product-cell img{width:58px;height:62px;object-fit:contain;background:#f7f4f2}.kit-description{min-width:180px;max-width:280px;white-space:normal}.kit-products{min-width:170px;display:grid;gap:4px}.kit-products span{font-size:.64rem}.kit-products small{color:#a0979a}.row-actions{display:flex;gap:6px}@media(max-width:600px){.admin-page-head{flex-wrap:wrap}.admin-page-head>.admin-btn{width:100%}.kit-search{width:100%}.kit-search input{width:100%}}
</style>
