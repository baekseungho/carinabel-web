<template>
    <main class="status-page page-shell">
        <div class="status-mark"><i class="fa-solid fa-seedling"></i></div>
        <p class="eyebrow">COMING SOON</p>
        <h1>더 좋은 모습으로<br />정성껏 준비하고 있습니다.</h1>
        <p class="status-copy">카리나벨의 새로운 프로그램을 곧 선보일 예정입니다.<br />공지사항에서 가장 먼저 소식을 확인해 주세요.</p>
        <div class="status-actions"><RouterLink to="/notices">새 소식 보기</RouterLink><RouterLink to="/">홈으로 돌아가기</RouterLink></div>
    </main>
</template>

<style scoped>
.status-page{min-height:calc(100vh - 84px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding-block:90px;text-align:center}.status-mark{width:76px;height:76px;display:grid;place-items:center;margin-bottom:25px;border-radius:50%;color:var(--color-brand);background:var(--color-warm);font-size:1.55rem}.status-page h1{margin:14px 0 20px;font-family:Georgia,"Noto Serif KR",serif;font-size:clamp(2.15rem,4vw,3.65rem);font-weight:400;line-height:1.35}.status-copy{color:var(--color-muted);font-size:.82rem;line-height:1.9}.status-actions{display:flex;gap:9px;margin-top:34px}.status-actions a{min-width:145px;padding:13px 20px;border:1px solid var(--color-brand-dark);font-size:.72rem;font-weight:700}.status-actions a:first-child{color:#fff;background:var(--color-brand-dark)}@media(max-width:500px){.status-actions{width:100%;flex-direction:column}.status-actions a{width:100%}}
</style>
