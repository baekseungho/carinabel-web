<template>
    <main class="not-found page-shell">
        <p class="error-code">404</p>
        <p class="eyebrow">PAGE NOT FOUND</p>
        <h1>찾으시는 페이지가<br />향기처럼 사라졌어요.</h1>
        <p>주소가 변경되었거나 존재하지 않는 페이지입니다.</p>
        <div><button type="button" @click="goBack"><i class="fa-solid fa-arrow-left"></i> 이전 페이지</button><RouterLink to="/">홈으로 이동</RouterLink></div>
    </main>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => window.history.length > 1 ? router.back() : router.push("/");
</script>

<style scoped>
.not-found{min-height:calc(100vh - 84px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding-block:90px;text-align:center}.error-code{color:#eadfe1;font-family:Georgia,serif;font-size:clamp(5rem,13vw,9rem);line-height:.85}.not-found .eyebrow{margin-top:25px}.not-found h1{margin:13px 0 17px;font-family:Georgia,"Noto Serif KR",serif;font-size:clamp(2.1rem,4vw,3.5rem);font-weight:400;line-height:1.35}.not-found>p:not(.eyebrow):last-of-type{color:var(--color-muted);font-size:.8rem}.not-found>div{display:flex;gap:9px;margin-top:34px}.not-found button,.not-found a{min-width:140px;padding:13px 18px;border:1px solid var(--color-brand-dark);background:#fff;color:var(--color-brand-dark);font-size:.72rem;font-weight:700}.not-found a{color:#fff;background:var(--color-brand-dark)}.not-found button i{margin-right:7px}@media(max-width:480px){.not-found>div{width:100%;flex-direction:column}.not-found button,.not-found a{width:100%}}
</style>
