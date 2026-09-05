<template>
    <div class="shop-page">
        <section class="shop-hero">
            <div class="page-shell hero-inner">
                <div><p class="eyebrow">ESSENTIAL OIL COLLECTION</p><h1>나를 위한 향기를<br />천천히 발견해 보세요.</h1></div>
                <p>자연에서 온 향을 한 병에 담았습니다.<br />일상의 기분과 공간에 어울리는 카리나벨의 에센셜 오일 컬렉션입니다.</p>
            </div>
        </section>

        <section class="catalog page-shell">
            <div class="catalog-tools">
                <div class="categories" role="group" aria-label="향 계열 필터">
                    <button v-for="category in categories" :key="category.value" :class="{ active: selectedCategory === category.value }" @click="selectedCategory = category.value">{{ category.label }}</button>
                </div>
                <div class="tool-actions">
                    <label class="search"><i class="fa-solid fa-magnifying-glass"></i><input v-model.trim="searchQuery" type="search" placeholder="제품명 검색" aria-label="제품명 검색" /></label>
                    <label class="sort"><span class="sr-only">정렬</span><select v-model="sortOption"><option value="recommended">추천순</option><option value="low">낮은 가격순</option><option value="high">높은 가격순</option><option value="name">이름순</option></select><i class="fa-solid fa-chevron-down"></i></label>
                </div>
            </div>

            <div class="result-meta"><p>총 <strong>{{ filteredProducts.length }}</strong>개의 향</p><span v-if="usingFallback">카리나벨 컬렉션</span></div>

            <div v-if="isLoading" class="product-grid" aria-label="상품을 불러오는 중">
                <div v-for="number in 8" :key="number" class="skeleton-card"><div></div><span></span><span></span></div>
            </div>
            <div v-else-if="filteredProducts.length" class="product-grid">
                <article v-for="(product, index) in filteredProducts" :key="product._id || product.id" class="product-card" role="link" tabindex="0" @click="goToDetail(product)" @keydown.enter="goToDetail(product)" @keydown.space.prevent="goToDetail(product)">
                    <div class="image-wrap">
                        <span v-if="index < 3 && selectedCategory === 'all' && !searchQuery" class="badge">BEST</span>
                        <img :src="product.imagePath || '/img/defalut_product.png'" :alt="product.koreanName" loading="lazy" />
                        <button type="button" class="quick-view" :aria-label="`${product.koreanName} 상세보기`">자세히 보기 <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                    <div class="card-copy"><p class="english-name">{{ product.productName || 'KARINABEL ESSENTIAL OIL' }}</p><h2>{{ product.koreanName }}</h2><p v-if="product.volume" class="volume">{{ product.volume }}ml</p><div class="prices"><strong>{{ formatPrice(product.memberPrice || product.consumerPrice) }}원</strong><del v-if="product.memberPrice && product.consumerPrice && product.memberPrice !== product.consumerPrice">{{ formatPrice(product.consumerPrice) }}원</del><span v-if="product.stock === 0" class="sold-out">품절</span></div></div>
                </article>
            </div>
            <div v-else class="empty-state"><i class="fa-solid fa-leaf"></i><h2>검색 결과가 없습니다.</h2><p>다른 제품명이나 향 계열로 다시 찾아보세요.</p><button @click="resetFilters">전체 제품 보기</button></div>
        </section>

        <aside class="shop-note"><div class="page-shell"><i class="fa-solid fa-circle-info"></i><p><strong>어떤 향을 골라야 할지 고민되시나요?</strong><span>Q&amp;A를 통해 편하게 문의해 주세요. 나에게 맞는 향을 함께 찾아드립니다.</span></p><RouterLink to="/qna">문의하기</RouterLink></div></aside>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ProductService from "@/api/ProductService.js";
import essentialOils from "@/assets/data/essentialoils.js";

const router = useRouter();
const products = ref([]); const isLoading = ref(true); const usingFallback = ref(false);
const searchQuery = ref(""); const selectedCategory = ref("all"); const sortOption = ref("recommended");
const categories = [{ label: "전체", value: "all" }, { label: "시트러스", value: "citrus" }, { label: "플로럴", value: "floral" }, { label: "허브", value: "herbal" }, { label: "우디", value: "woody" }];
const scentGroups = {
    citrus: ["lemon", "orange", "grapefruit", "bergamot", "레몬", "오렌지", "자몽", "베르가모"],
    floral: ["rose", "jasmine", "lavender", "ylang", "neroli", "geranium", "로즈", "자스민", "라벤더", "일랑", "네롤리", "제라늄"],
    herbal: ["peppermint", "tea tree", "eucalyptus", "rosemary", "basil", "fennel", "marjoram", "페퍼민트", "티트리", "유칼립투스", "로즈마리", "바질", "펜넬", "마조람"],
    woody: ["frankincense", "myrrh", "cypress", "patchouli", "프랑킨센스", "미르", "사이프레스", "파촐리"],
};
const getSearchText = (product) => `${product.koreanName || ""} ${product.productName || ""}`.toLowerCase();
const filteredProducts = computed(() => {
    let result = products.value.filter((product) => {
        const text = getSearchText(product); const matchesSearch = !searchQuery.value || text.includes(searchQuery.value.toLowerCase());
        const matchesCategory = selectedCategory.value === "all" || scentGroups[selectedCategory.value]?.some((keyword) => text.includes(keyword));
        return matchesSearch && matchesCategory;
    });
    if (sortOption.value === "low") result = [...result].sort((a,b) => (a.memberPrice || a.consumerPrice || 0) - (b.memberPrice || b.consumerPrice || 0));
    if (sortOption.value === "high") result = [...result].sort((a,b) => (b.memberPrice || b.consumerPrice || 0) - (a.memberPrice || a.consumerPrice || 0));
    if (sortOption.value === "name") result = [...result].sort((a,b) => (a.koreanName || "").localeCompare(b.koreanName || "", "ko"));
    return result;
});
const loadProducts = async () => {
    try { const response = await ProductService.getProducts(localStorage.getItem("token")); products.value = Array.isArray(response.data) && response.data.length ? response.data : essentialOils.items; usingFallback.value = !response.data?.length; }
    catch { products.value = essentialOils.items; usingFallback.value = true; }
    finally { isLoading.value = false; }
};
const formatPrice = (price) => Number(price || 0).toLocaleString("ko-KR");
const goToDetail = (product) => router.push({ name: product._id ? "OnlymemberDetail" : "ProductDetail", params: { id: product._id || product.id } });
const resetFilters = () => { searchQuery.value = ""; selectedCategory.value = "all"; sortOption.value = "recommended"; };
onMounted(loadProducts);
</script>

<style scoped>
.shop-page{background:#fff}.shop-hero{padding:86px 0 78px;background:linear-gradient(120deg,#f8f4f1,#f2ecee)}.hero-inner{display:flex;align-items:flex-end;justify-content:space-between;gap:60px}.shop-hero h1{margin-top:14px;font-family:Georgia,"Noto Serif KR",serif;font-size:clamp(2.5rem,4.6vw,4.3rem);font-weight:400;line-height:1.28;letter-spacing:-.045em}.hero-inner>p{max-width:470px;margin-bottom:10px;color:var(--color-muted);font-size:.96rem;line-height:1.9}.catalog{padding-block:70px 120px}.catalog-tools{display:flex;align-items:center;justify-content:space-between;gap:30px;padding-bottom:24px;border-bottom:1px solid var(--color-line)}.categories{display:flex;gap:6px}.categories button{padding:9px 17px;border:1px solid transparent;border-radius:999px;background:transparent;color:var(--color-muted);font-size:.84rem;cursor:pointer}.categories button.active{border-color:var(--color-brand);color:#fff;background:var(--color-brand);font-weight:700}.tool-actions{display:flex;gap:10px}.search{width:210px;display:flex;align-items:center;gap:10px;padding:9px 12px;border-bottom:1px solid #aaa}.search i{color:#a59a9f;font-size:.8rem}.search input{width:100%;border:0;outline:0;background:transparent;font-size:.82rem}.sort{position:relative;min-width:128px}.sort select{width:100%;padding:10px 30px 10px 13px;border:1px solid var(--color-line);background:#fff;color:var(--color-muted);font-size:.8rem;appearance:none;outline:0}.sort i{position:absolute;right:12px;top:15px;font-size:.6rem;pointer-events:none}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}.result-meta{display:flex;justify-content:space-between;margin:28px 0 20px;color:var(--color-muted);font-size:.78rem}.result-meta strong{color:var(--color-ink)}.result-meta span{color:#a2969c}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:48px 24px}.product-card{cursor:pointer}.image-wrap{position:relative;aspect-ratio:1/1.12;overflow:hidden;background:#f7f5f2}.image-wrap>img{width:100%;height:100%;padding:20px;object-fit:contain;transition:transform .5s ease}.product-card:hover .image-wrap>img{transform:scale(1.04)}.badge{position:absolute;top:13px;left:13px;z-index:2;padding:5px 8px;color:#fff;background:var(--color-brand);font-size:.58rem;font-weight:800;letter-spacing:.09em}.quick-view{position:absolute;right:12px;bottom:12px;left:12px;padding:12px;border:0;color:#fff;background:rgba(50,39,44,.9);font-size:.76rem;font-weight:700;opacity:0;transform:translateY(10px);transition:.25s;cursor:pointer}.quick-view i{margin-left:10px}.product-card:hover .quick-view{opacity:1;transform:none}.card-copy{position:relative;padding-top:17px}.english-name{overflow:hidden;color:#9c9196;font-size:.62rem;letter-spacing:.08em;white-space:nowrap;text-overflow:ellipsis;text-transform:uppercase}.card-copy h2{margin-top:3px;font-size:1rem;font-weight:600}.volume{position:absolute;top:39px;right:0;color:#a69da1;font-size:.72rem}.prices{display:flex;align-items:center;gap:9px;margin-top:9px}.prices strong{font-size:.88rem}.prices del{color:#aaa;font-size:.72rem}.sold-out{margin-left:auto;padding:3px 6px;color:#9a676e;background:#f8eaec;font-size:.62rem}.empty-state{padding:110px 20px;text-align:center;background:var(--color-warm)}.empty-state i{color:var(--color-accent);font-size:2rem}.empty-state h2{margin:15px 0 5px;font-size:1.2rem}.empty-state p{color:var(--color-muted);font-size:.86rem}.empty-state button{margin-top:23px;padding:11px 20px;border:1px solid var(--color-brand);background:transparent;color:var(--color-brand);cursor:pointer}.skeleton-card>div{aspect-ratio:1/1.12;background:#f3f0ed;animation:pulse 1.4s infinite}.skeleton-card span{display:block;width:70%;height:11px;margin-top:14px;background:#f3f0ed}.skeleton-card span:last-child{width:42%;margin-top:9px}@keyframes pulse{50%{opacity:.45}}.shop-note{padding:38px 0;background:#30292d;color:#fff}.shop-note .page-shell{display:flex;align-items:center;gap:20px}.shop-note i{color:#d2a6aa}.shop-note p{display:flex;flex-direction:column;flex:1}.shop-note strong{font-size:.9rem}.shop-note span{margin-top:2px;color:#aaa0a5;font-size:.76rem}.shop-note a{padding:10px 19px;border:1px solid #74676d;font-size:.76rem}
@media(max-width:950px){.hero-inner{align-items:flex-start;flex-direction:column;gap:24px}.product-grid{grid-template-columns:repeat(3,1fr)}.catalog-tools{align-items:flex-start;flex-direction:column}.tool-actions{width:100%}.search{flex:1}}@media(max-width:680px){.shop-hero{padding:58px 0 52px}.shop-hero h1{font-size:2.45rem}.hero-inner>p{font-size:.86rem}.catalog{padding-block:42px 80px}.categories{width:100%;overflow-x:auto;padding-bottom:3px}.categories button{flex:0 0 auto;padding:8px 14px}.tool-actions{flex-direction:column}.search,.sort{width:100%}.product-grid{grid-template-columns:repeat(2,1fr);gap:34px 12px}.image-wrap>img{padding:8px}.quick-view{display:none}.volume{position:static;margin-top:3px}.card-copy h2{font-size:.9rem}.prices{align-items:flex-start;flex-direction:column;gap:2px}.sold-out{margin-left:0}.shop-note .page-shell{align-items:flex-start;flex-wrap:wrap}.shop-note p{min-width:calc(100% - 45px)}.shop-note a{margin-left:40px}}
</style>
