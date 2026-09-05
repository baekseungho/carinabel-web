<template>
  <button class="buyProductButton" type="button" :disabled="disabled || opening" @click="openPartnerStore">
    {{ opening ? "이동 중..." : "제휴 쇼핑몰에서 구매하기" }}
    <i class="fa-solid fa-arrow-up-right-from-square"></i>
  </button>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  product: { type: [Object, Array], default: null },
  quantity: { type: Number, default: 1 },
  userInfo: { type: Object, default: null },
  disabled: Boolean,
  orderType: { type: String, default: "oil" },
});

const opening = ref(false);
const partnerStoreUrl = "https://ngnmall.com/pc/product/category-list?prdCtgIdx=25";

function openPartnerStore() {
  if (opening.value) return;
  opening.value = true;
  const popup = window.open(partnerStoreUrl, "_blank", "noopener,noreferrer");
  if (!popup) alert("팝업이 차단되었습니다. 브라우저에서 팝업을 허용해 주세요.");
  window.setTimeout(() => { opening.value = false; }, 700);
}
</script>

<style scoped>
.buyProductButton{width:100%;min-height:54px;display:flex;align-items:center;justify-content:center;gap:9px;padding:14px 24px;border:1px solid transparent;border-radius:2px;color:#fff;background:linear-gradient(135deg,var(--color-brand-dark,#563f4c),#765766);font-size:.9rem;font-weight:700;letter-spacing:.02em;cursor:pointer;transition:transform .2s,box-shadow .2s,background .2s}.buyProductButton:hover:not(:disabled){background:linear-gradient(135deg,#49353f,#674b59);box-shadow:0 10px 24px rgba(70,48,59,.22);transform:translateY(-1px)}.buyProductButton:focus-visible{outline:3px solid rgba(118,87,102,.28);outline-offset:3px}.buyProductButton:disabled{color:#857b80;background:#d8d2d4;box-shadow:none;cursor:not-allowed;opacity:.72}
</style>
