<template>
    <div class="cart-page">
        <header class="page-header page-shell"><p class="eyebrow">SHOPPING BAG</p><h1>장바구니</h1><p>선택한 향기를 확인하고 주문을 진행해 주세요.</p></header>

        <main class="page-shell cart-layout">
            <section class="cart-content">
                <div class="content-heading"><h2>담은 상품 <span>{{ totalQuantity }}</span></h2><button v-if="cartItems.length" type="button" :disabled="isClearing" @click="clearCart">{{ isClearing ? '비우는 중' : '전체 삭제' }}</button></div>

                <div v-if="isLoading" class="loading-list"><div v-for="n in 3" :key="n" class="loading-item"><span></span><div><i></i><i></i><i></i></div></div></div>
                <div v-else-if="loadError" class="state-box"><i class="fa-solid fa-triangle-exclamation"></i><h2>장바구니를 불러오지 못했습니다.</h2><p>잠시 후 다시 시도해 주세요.</p><button @click="getCartList">다시 불러오기</button></div>
                <div v-else-if="!cartItems.length" class="state-box empty"><i class="fa-solid fa-bag-shopping"></i><h2>장바구니가 비어 있습니다.</h2><p>나에게 어울리는 향기를 둘러보세요.</p><RouterLink to="/products/onlymember">제품 보러 가기 <i class="fa-solid fa-arrow-right"></i></RouterLink></div>

                <div v-else class="cart-list">
                    <article v-for="item in cartItems" :key="item._id" class="cart-item">
                        <RouterLink :to="`/products/onlymember/${item.productId?._id}`" class="item-image"><img :src="item.productId?.imagePath || '/img/defalut_product.png'" :alt="item.productId?.koreanName || '상품 이미지'" /></RouterLink>
                        <div class="item-info"><p class="brand-label">KARINABEL ESSENTIAL OIL</p><h2>{{ item.productId?.koreanName || '판매 중인 상품' }}</h2><p class="item-en">{{ item.productId?.productName }}</p><span v-if="item.productId?.volume" class="item-option">용량 {{ item.productId.volume }}ml</span></div>
                        <div class="item-control"><div class="quantity"><button :disabled="item.quantity <= 1 || updatingIds.has(item._id)" aria-label="수량 줄이기" @click="changeQuantity(item, -1)"><i class="fa-solid fa-minus"></i></button><strong>{{ item.quantity }}</strong><button :disabled="updatingIds.has(item._id) || item.productId?.stock === 0 || (Number.isFinite(Number(item.productId?.stock)) && item.quantity >= Number(item.productId.stock))" aria-label="수량 늘리기" @click="changeQuantity(item, 1)"><i class="fa-solid fa-plus"></i></button></div><strong class="item-price">{{ formatPrice(item.price * item.quantity) }}원</strong><button class="remove" :disabled="deletingIds.has(item._id)" @click="deleteItem(item._id)"><i class="fa-regular fa-trash-can"></i><span>{{ deletingIds.has(item._id) ? '삭제 중' : '삭제' }}</span></button></div>
                    </article>
                </div>
            </section>

            <aside v-if="!isLoading && cartItems.length" class="summary">
                <p class="eyebrow">ORDER SUMMARY</p><h2>결제 금액</h2>
                <dl><div><dt>상품 금액</dt><dd>{{ formatPrice(totalPrice) }}원</dd></div><div><dt>배송비</dt><dd>결제 시 안내</dd></div><div class="discount"><dt>회원 혜택</dt><dd>회원가 적용</dd></div></dl>
                <div class="summary-total"><span>총 결제 예정 금액</span><strong>{{ formatPrice(totalPrice) }}원</strong></div>
                <Winpay class="checkout" :product="cartItems" :userInfo="user" orderType="cart" />
                <p class="payment-note"><i class="fa-solid fa-shield-halved"></i> 안전한 결제를 위해 제휴 결제 페이지로 이동합니다.</p>
                <RouterLink to="/products/onlymember" class="continue-link"><i class="fa-solid fa-arrow-left"></i> 쇼핑 계속하기</RouterLink>
            </aside>
        </main>
        <section class="cart-benefits"><div class="page-shell"><p><i class="fa-solid fa-box"></i><span><strong>꼼꼼한 포장</strong>안전하게 포장해 보내드립니다.</span></p><p><i class="fa-regular fa-comments"></i><span><strong>제품 상담</strong>궁금한 점은 언제든 문의해 주세요.</span></p><p><i class="fa-solid fa-lock"></i><span><strong>안전한 결제</strong>결제 정보를 안전하게 보호합니다.</span></p></div></section>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import CartService from "@/api/CartService.js";
import Winpay from "@/components/payment/Winpay.vue";
import { getStoredToken, getStoredUser } from "@/utils/storage";

const cartItems = ref([]); const isLoading = ref(true); const loadError = ref(false); const isClearing = ref(false);
const updatingIds = ref(new Set()); const deletingIds = ref(new Set());
const token = getStoredToken(); const user = ref(getStoredUser());
const totalPrice = computed(() => cartItems.value.reduce((sum,item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0));
const totalQuantity = computed(() => cartItems.value.reduce((sum,item) => sum + Number(item.quantity || 0), 0));
const formatPrice = (price) => Number(price || 0).toLocaleString("ko-KR");
const getCartList = async () => { isLoading.value = true; loadError.value = false; if (!token) { cartItems.value = []; isLoading.value = false; return; } try { const response = await CartService.getCartList(token); cartItems.value = Array.isArray(response.data) ? response.data : []; } catch (error) { console.error(error); loadError.value = true; } finally { isLoading.value = false; } };
const changeQuantity = async (item, amount) => { const next = item.quantity + amount; if (next < 1 || updatingIds.value.has(item._id)) return; const previous = item.quantity; item.quantity = next; updatingIds.value = new Set(updatingIds.value).add(item._id); try { await CartService.updateCart(item._id, next, token); } catch (error) { console.error(error); item.quantity = previous; alert("수량을 변경하지 못했습니다."); } finally { const ids = new Set(updatingIds.value); ids.delete(item._id); updatingIds.value = ids; } };
const deleteItem = async (id) => { if (deletingIds.value.has(id)) return; deletingIds.value = new Set(deletingIds.value).add(id); try { await CartService.deleteCartItem(id, token); cartItems.value = cartItems.value.filter(item => item._id !== id); } catch (error) { console.error(error); alert("상품을 삭제하지 못했습니다."); } finally { const ids = new Set(deletingIds.value); ids.delete(id); deletingIds.value = ids; } };
const clearCart = async () => { if (!confirm("장바구니의 모든 상품을 삭제할까요?")) return; isClearing.value = true; try { await CartService.clearCart(token); cartItems.value = []; } catch (error) { console.error(error); alert("장바구니를 비우지 못했습니다."); } finally { isClearing.value = false; } };
onMounted(getCartList);
</script>

<style>
.cart-page{background:#fff}.page-header{padding-block:72px 50px;text-align:center}.page-header h1{margin:9px 0 7px;font-family:Georgia,"Noto Serif KR",serif;font-size:clamp(2.5rem,4vw,3.8rem);font-weight:400}.page-header>p:last-child{color:var(--color-muted);font-size:.87rem}.cart-layout{display:grid;grid-template-columns:minmax(0,1fr) 370px;gap:55px;padding-bottom:120px}.content-heading{display:flex;align-items:center;justify-content:space-between;height:50px;border-bottom:1px solid #332d30}.content-heading h2{font-size:.9rem}.content-heading h2 span{margin-left:4px;color:var(--color-accent)}.content-heading button{border:0;background:transparent;color:#948a8f;font-size:.72rem;cursor:pointer}.cart-item{display:grid;grid-template-columns:150px 1fr 170px;gap:24px;padding:28px 0;border-bottom:1px solid var(--color-line)}.item-image{aspect-ratio:1;background:#f7f5f2}.item-image img{width:100%;height:100%;padding:10px;object-fit:contain}.item-info{align-self:center}.brand-label{color:#a4959c;font-size:.57rem;letter-spacing:.1em}.item-info h2{margin-top:5px;font-size:1.05rem}.item-en{color:#9f969a;font-size:.68rem}.item-option{display:inline-block;margin-top:15px;padding:5px 8px;background:var(--color-warm);color:#756c70;font-size:.68rem}.item-control{display:flex;flex-direction:column;align-items:flex-end;justify-content:center}.quantity{display:grid;grid-template-columns:32px 36px 32px;height:32px;border:1px solid var(--color-line)}.quantity button{border:0;background:#fff;font-size:.6rem}.quantity button:disabled{color:#d3cdd0}.quantity strong{display:grid;place-items:center;border-inline:1px solid var(--color-line);font-size:.72rem}.item-price{margin-top:14px;font-size:.95rem}.remove{margin-top:17px;border:0;background:transparent;color:#9c9297;font-size:.68rem;cursor:pointer}.remove i{margin-right:5px}.summary{position:sticky;top:115px;align-self:start;padding:34px;background:#f7f4f1}.summary h2{margin:7px 0 25px;font-family:Georgia,"Noto Serif KR",serif;font-size:1.75rem;font-weight:400}.summary dl{padding-block:5px 20px;border-bottom:1px solid #ded6d2}.summary dl div{display:flex;justify-content:space-between;margin:11px 0;color:#625a5e;font-size:.78rem}.summary .discount dd{color:var(--color-accent)}.summary-total{display:flex;align-items:flex-end;justify-content:space-between;padding:24px 0}.summary-total span{font-size:.78rem;font-weight:700}.summary-total strong{color:var(--color-brand-dark);font-size:1.3rem}.summary :deep(.buyProductButton){width:100%!important;height:54px;padding:0!important;display:grid;place-items:center;border-radius:0!important;background:var(--color-brand-dark)!important;font-size:.88rem!important}.payment-note{margin-top:12px;color:#948b8f;font-size:.64rem;line-height:1.5}.payment-note i{margin-right:5px}.continue-link{display:block;margin-top:25px;text-align:center;font-size:.73rem}.continue-link i{margin-right:8px}.state-box{padding:100px 20px;text-align:center;background:var(--color-warm)}.state-box>i{color:var(--color-accent);font-size:2rem}.state-box h2{margin:15px 0 4px;font-size:1.1rem}.state-box p{color:var(--color-muted);font-size:.8rem}.state-box button,.state-box a{display:inline-block;margin-top:23px;padding:11px 20px;border:1px solid var(--color-brand);color:var(--color-brand);background:#fff;font-size:.78rem}.loading-item{display:grid;grid-template-columns:150px 1fr;gap:24px;padding:28px 0;border-bottom:1px solid var(--color-line)}.loading-item>span{height:150px;background:#f4f1ef}.loading-item div{padding-top:25px}.loading-item i{display:block;width:50%;height:13px;margin-bottom:15px;background:#f4f1ef;animation:pulse 1.3s infinite}.loading-item i:nth-child(2){width:30%}.loading-item i:nth-child(3){width:20%}.cart-benefits{padding:40px 0;background:#30292d;color:#fff}.cart-benefits>div{display:grid;grid-template-columns:repeat(3,1fr)}.cart-benefits p{display:flex;align-items:center;gap:16px;padding:8px 35px;border-right:1px solid #51464b}.cart-benefits p:last-child{border:0}.cart-benefits i{color:#d0a3a8;font-size:1.25rem}.cart-benefits span{display:flex;flex-direction:column;color:#a99fa4;font-size:.66rem}.cart-benefits strong{color:#fff;font-size:.78rem}@keyframes pulse{50%{opacity:.4}}
@media(max-width:950px){.cart-layout{grid-template-columns:1fr}.summary{position:static}.cart-benefits>div{grid-template-columns:1fr}.cart-benefits p{padding:18px 8px;border-right:0;border-bottom:1px solid #51464b}}@media(max-width:600px){.page-header{padding-block:50px 35px}.cart-layout{gap:30px;padding-bottom:70px}.cart-item{grid-template-columns:105px 1fr;gap:15px;padding:20px 0}.item-control{grid-column:1/-1;display:grid;grid-template-columns:auto 1fr auto;align-items:center}.item-price{margin:0;text-align:center}.remove{margin:0}.loading-item{grid-template-columns:105px 1fr}.loading-item>span{height:105px}.summary{padding:27px 22px}}
</style>
