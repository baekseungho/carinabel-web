<template>
    <div class="home">
        <section class="hero">
            <img src="/banner/1.jpg" alt="자연 속 카리나벨 에센셜 오일" fetchpriority="high" />
            <div class="hero-shade"></div>
            <div class="hero-content page-shell">
                <p class="hero-kicker">NATURE, CAPTURED IN A DROP</p>
                <h1>자연의 생명력을<br />한 방울에 담다</h1>
                <p class="hero-copy">일상의 감각을 깨우는 순수한 향기.<br />카리나벨이 엄선한 에센셜 오일을 만나보세요.</p>
                <RouterLink to="/products/onlymember" class="hero-cta">제품 둘러보기 <i class="fa-solid fa-arrow-right"></i></RouterLink>
            </div>
            <span class="scroll-hint">SCROLL <i class="fa-solid fa-arrow-down"></i></span>
        </section>

        <section class="intro page-shell">
            <p class="eyebrow">OUR PHILOSOPHY</p>
            <h2>향기는 순간을 기억하게 하고,<br />일상을 조금 더 특별하게 만듭니다.</h2>
            <p>소중하고 사랑스러운이라는 뜻의 ‘카리나’와 생명력을 뜻하는 ‘아벨’. 카리나벨은 자연이 가진 순수한 에너지를 향기로 전합니다.</p>
            <RouterLink to="/about/story" class="text-link">브랜드 이야기 <i class="fa-solid fa-arrow-right-long"></i></RouterLink>
        </section>

        <section class="featured page-shell">
            <div class="section-heading"><div><p class="eyebrow">SIGNATURE COLLECTION</p><h2>처음 만나는 카리나벨</h2></div><RouterLink to="/products/onlymember">전체 제품 보기 <i class="fa-solid fa-arrow-right"></i></RouterLink></div>
            <div class="product-grid">
                <RouterLink v-for="product in featuredProducts" :key="product.id" :to="`/products/essential/${product.id}`" class="product-card">
                    <div class="product-image"><span>BEST</span><img :src="product.imagePath" :alt="product.koreanName" loading="lazy" decoding="async" /></div>
                    <p class="product-en">{{ product.productName }}</p><h3>{{ product.koreanName }}</h3><p class="product-price">{{ product.consumerPrice.toLocaleString() }}원</p>
                </RouterLink>
            </div>
        </section>

        <section class="story-banner">
            <div class="story-image"><img src="/banner/4.jpg" alt="식물과 자연에서 시작되는 카리나벨의 향기" loading="lazy" decoding="async" /></div>
            <div class="story-copy"><p class="eyebrow">FROM NATURE</p><h2>자연을 닮은 사람,<br />카리나벨</h2><p>오랜 시간 향의 시작점을 탐구하고 엄격한 기준으로 선별했습니다. 공간과 마음을 채우는 깊고 순수한 향을 경험해 보세요.</p><RouterLink to="/about/greeting" class="story-button">카리나벨 알아보기</RouterLink></div>
        </section>

        <section class="benefits page-shell">
            <article><i class="fa-solid fa-leaf"></i><div><h3>엄선된 원료</h3><p>자연에서 시작된 품질 좋은 원료를 선별합니다.</p></div></article>
            <article><i class="fa-solid fa-droplet"></i><div><h3>순수한 한 방울</h3><p>향의 본질을 온전히 경험할 수 있도록 담았습니다.</p></div></article>
            <article><i class="fa-regular fa-comments"></i><div><h3>향기 큐레이션</h3><p>나에게 맞는 향을 편안하게 상담해 드립니다.</p></div></article>
        </section>
    </div>
</template>

<script setup>
import essentialOils from "@/assets/data/essentialoils.js";
const featuredProducts = essentialOils.items.slice(0, 4);
</script>

<style scoped>
.hero{position:relative;height:clamp(620px,calc(100vh - 84px),820px);overflow:hidden;color:#fff}.hero>img{width:100%;height:100%;object-fit:cover;object-position:center}.hero-shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(30,20,24,.64) 0%,rgba(30,20,24,.22) 50%,rgba(30,20,24,.03) 75%)}.hero-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start}.hero-kicker{margin-bottom:20px;font-size:.72rem;font-weight:700;letter-spacing:.26em}.hero h1{font-family:Georgia,"Noto Serif KR",serif;font-size:clamp(2.9rem,5.7vw,5.3rem);font-weight:400;line-height:1.18;letter-spacing:-.045em}.hero-copy{margin:25px 0 34px;font-size:clamp(.95rem,1.3vw,1.1rem);line-height:1.8;color:rgba(255,255,255,.85)}.hero-cta{padding:14px 24px;border:1px solid rgba(255,255,255,.75);font-size:.86rem;font-weight:700;transition:.25s}.hero-cta i{margin-left:30px}.hero-cta:hover{color:var(--color-brand-dark);background:#fff}.scroll-hint{position:absolute;right:3%;bottom:34px;display:flex;gap:12px;align-items:center;font-size:.63rem;letter-spacing:.18em;writing-mode:vertical-rl}.intro{padding-block:130px;text-align:center}.intro h2,.section-heading h2,.story-copy h2{font-family:Georgia,"Noto Serif KR",serif;font-weight:400;letter-spacing:-.035em}.intro h2{margin:18px 0 25px;font-size:clamp(2rem,3.6vw,3.2rem);line-height:1.4}.intro>p:not(.eyebrow){max-width:650px;margin:auto;color:var(--color-muted);line-height:1.9}.text-link{display:inline-block;margin-top:30px;padding-bottom:5px;border-bottom:1px solid var(--color-ink);font-size:.86rem;font-weight:700}.text-link i{margin-left:14px}.featured{padding-bottom:140px}.section-heading{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:38px}.section-heading h2{margin-top:8px;font-size:clamp(2rem,3vw,2.8rem)}.section-heading>a{padding-bottom:5px;border-bottom:1px solid var(--color-line);font-size:.82rem}.section-heading>a i{margin-left:12px}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}.product-image{position:relative;aspect-ratio:1/1.15;overflow:hidden;background:#f6f3ef}.product-image span{position:absolute;top:14px;left:14px;z-index:1;padding:6px 9px;background:var(--color-brand);color:#fff;font-size:.6rem;font-weight:800;letter-spacing:.08em}.product-image img{width:100%;height:100%;object-fit:contain;padding:22px;transition:transform .5s}.product-card:hover .product-image img{transform:scale(1.045)}.product-en{margin-top:18px;color:#9b9095;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase}.product-card h3{margin-top:3px;font-size:1rem;font-weight:600}.product-price{margin-top:8px;font-size:.86rem;font-weight:700}.story-banner{display:grid;grid-template-columns:1.25fr 1fr;min-height:600px;background:var(--color-warm)}.story-image img{width:100%;height:100%;object-fit:cover}.story-copy{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:70px clamp(40px,7vw,120px)}.story-copy h2{margin:16px 0 25px;font-size:clamp(2.2rem,3.8vw,3.5rem);line-height:1.3}.story-copy>p:not(.eyebrow){max-width:480px;color:var(--color-muted);line-height:1.9}.story-button{margin-top:32px;padding:13px 22px;background:var(--color-brand-dark);color:#fff;font-size:.82rem;font-weight:700}.benefits{display:grid;grid-template-columns:repeat(3,1fr);padding-block:80px}.benefits article{display:flex;align-items:center;gap:20px;padding:15px 40px;border-right:1px solid var(--color-line)}.benefits article:last-child{border:0}.benefits i{color:var(--color-accent);font-size:1.5rem}.benefits h3{font-size:.94rem}.benefits p{margin-top:3px;color:var(--color-muted);font-size:.78rem}
@media(max-width:900px){.product-grid{grid-template-columns:repeat(2,1fr)}.story-banner{grid-template-columns:1fr}.story-image{height:430px}.benefits{grid-template-columns:1fr}.benefits article{border-right:0;border-bottom:1px solid var(--color-line)}}@media(max-width:600px){.hero{height:650px}.hero-shade{background:rgba(30,20,24,.42)}.hero h1{font-size:2.7rem}.scroll-hint{display:none}.intro{padding-block:90px}.featured{padding-bottom:90px}.section-heading>a{display:none}.product-grid{gap:24px 12px}.product-image img{padding:10px}.product-en{font-size:.57rem}.product-card h3{font-size:.9rem}.story-image{height:330px}.story-copy{padding:60px 24px}.benefits{padding-block:50px}.benefits article{padding:22px 12px}}
</style>
