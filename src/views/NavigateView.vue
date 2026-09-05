<template>
  <main class="about-page">
    <section class="location-hero">
      <div class="page-shell">
        <p class="eyebrow">VISIT KARINABEL</p>
        <h1>카리나벨로<br />찾아오시는 길</h1>
      </div>
    </section>
    <nav class="about-tabs">
      <RouterLink to="/about/greeting">인사말</RouterLink
      ><RouterLink to="/about/story">브랜드 스토리</RouterLink
      ><RouterLink to="/about/navigate">찾아오시는 길</RouterLink>
    </nav>
    <section class="location-section page-shell">
      <div class="location-heading">
        <p class="eyebrow">LOCATION</p>
        <h2>카리나벨 본사</h2>
        <p>
          방문 전 고객센터로 연락해 주시면 더욱 편리하게 안내받으실 수 있습니다.
        </p>
      </div>
      <div class="location-grid">
        <div class="location-map">
          <iframe
            title="카리나벨 본사 위치"
            src="https://www.google.com/maps?q=36.3755,127.31636&z=17&output=embed"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
        </div>
        <div class="location-info">
          <article>
            <span><i class="fa-solid fa-location-dot"></i></span>
            <div>
              <small>ADDRESS</small
              ><strong>대전광역시 유성구 은구비남로7번길 73</strong>
              <p>3층 301호 카리나벨</p>
            </div>
          </article>
          <article>
            <span><i class="fa-solid fa-phone"></i></span>
            <div>
              <small>CONTACT</small><a href="tel:042-822-2581">042-822-2581</a>
              <p>FAX 042-822-2582</p>
            </div>
          </article>
          <article>
            <span><i class="fa-regular fa-envelope"></i></span>
            <div>
              <small>EMAIL</small
              ><a href="mailto:karinabel@naver.com">karinabel@naver.com</a>
            </div>
          </article>
          <article>
            <span><i class="fa-regular fa-clock"></i></span>
            <div>
              <small>OPENING HOURS</small><strong>평일 09:00 — 18:00</strong>
              <p>주말 및 공휴일 휴무</p>
            </div>
          </article>
          <a
            class="map-link"
            href="https://map.naver.com/p/search/대전광역시%20유성구%20은구비남로7번길%2073"
            target="_blank"
            rel="noopener"
            >네이버 지도에서 길찾기 <i class="fa-solid fa-arrow-right"></i
          ></a>
        </div>
      </div>
    </section>
  </main>
</template>
<style>
.location-hero {
  padding: 110px 0;
  color: #fff;
  background:
    linear-gradient(90deg, rgba(38, 27, 32, 0.72), rgba(38, 27, 32, 0.1)),
    url("/banner/2.jpg") center/cover;
}
.location-hero h1 {
  margin-top: 15px;
  font-family: Georgia, "Noto Serif KR", serif;
  font-size: clamp(2.8rem, 5vw, 4.6rem);
  font-weight: 400;
  line-height: 1.25;
}
.location-section {
  padding-block: 95px 120px;
}
.location-heading {
  text-align: center;
}
.location-heading h2 {
  margin: 9px 0;
  font-family: Georgia, "Noto Serif KR", serif;
  font-size: 2.5rem;
  font-weight: 400;
}
.location-heading > p:last-child {
  color: #8d8388;
  font-size: 0.75rem;
}
.location-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  min-height: 530px;
  margin-top: 45px;
}
.location-map {
  min-height: 500px;
  background: #eee9e6;
}
.location-map iframe {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border: 0;
  filter: saturate(0.75) contrast(0.95);
}
.location-info {
  padding: 35px 40px;
  background: #332c30;
  color: #fff;
}
.location-info article {
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 12px;
  padding: 18px 0;
  border-bottom: 1px solid #50454a;
}
.location-info article > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  color: #d1a4ac;
  background: #40373b;
}
.location-info small,
.location-info strong,
.location-info article p,
.location-info article a {
  display: block;
}
.location-info small {
  color: #a99da2;
  font-size: 0.52rem;
  letter-spacing: 0.13em;
}
.location-info strong,
.location-info article a {
  margin-top: 4px;
  color: #fff;
  font-size: 0.76rem;
}
.location-info article p {
  margin-top: 2px;
  color: #a99fa3;
  font-size: 0.64rem;
}
.map-link {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  padding: 13px 16px;
  color: #fff;
  background: var(--color-brand);
  font-size: 0.7rem;
}
@media (max-width: 800px) {
  .location-hero {
    padding: 75px 0;
  }
  .location-section {
    padding-block: 70px;
  }
  .location-grid {
    grid-template-columns: 1fr;
  }
  .location-map,
  .location-map iframe {
    min-height: 400px;
  }
  .location-info {
    padding: 25px 22px;
  }
}
</style>
