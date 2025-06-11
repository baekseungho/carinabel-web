<template>
    <div class="navigateContainer">
        <div class="navigateContent">
            <div class="mapFormWrapper">
                <div id="map" class="mapWrapper"></div>
                <div class="contactForm">
                    <h2>Contact With Us</h2>
                    <p>If you have any questions please feel free to contact with us.</p>
                    <form @submit.prevent="sendmemberId">
                        <div class="inputGroup">
                            <input v-model="company" type="text" placeholder="회사명" required />
                            <input v-model="name" type="text" placeholder="담당자명" required />
                        </div>
                        <div class="inputGroup">
                            <input v-model="phone" type="text" placeholder="연락처" required />
                            <input v-model="memberId" type="memberId" placeholder="회원번호" required />
                        </div>
                        <textarea v-model="message" placeholder="문의내용" required></textarea>
                        <button type="submit" class="submitButton">Send</button>
                    </form>
                </div>
            </div>
            <div class="contactInfoWrapper">
                <div class="contactInfo themaBgColor6">
                    <div class="bigIcon call"></div>
                    042.488.9302
                </div>
                <div class="contactInfo themaBgColor6">
                    <div class="bigIcon location"></div>
                    대전 유성구 은구비남로7번길 73 3층
                </div>
                <div class="contactInfo themaBgColor6">
                    <div class="bigIcon mail"></div>
                    karinable@karinabel.com
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const company = ref("");
const name = ref("");
const phone = ref("");
const memberId = ref("");
const message = ref("");

function initializeMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 36.3755, lng: 127.31636 },
        zoom: 17,
    });

    const marker = new google.maps.Marker({
        position: { lat: 36.3755, lng: 127.31636 },
        map,
        title: "(주)카리나벨",
    });
    const infoWindow = new google.maps.InfoWindow({
        content: "<strong>(주)카리나벨</strong>",
    });

    // 마커 클릭 없이 바로 정보창 열기
    infoWindow.open(map, marker);

    // 마커 클릭 시 정보창 다시 열기 (선택 사항)
    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });
}

onMounted(() => {
    if (!window.google || !window.google.maps) {
        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDcNgrHakFpf9NDhsoORSAfTg3vAoBWUMc";
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
    } else {
        initializeMap();
    }
});

function sendmemberId() {
    const mailto = `mailto:vudrkd1580@naver.com?subject=문의사항 (${company.value})&body=회사명: ${company.value}%0D%0A담당자명: ${name.value}%0D%0A연락처: ${phone.value}%0D%0A회원번호: ${memberId.value}%0D%0A문의내용: ${message.value}`;
    window.location.href = mailto;
}
</script>

<style scoped>
.navigateContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    background-color: #f7f7f7;
}
.navigateContent {
    max-width: 1200px;
    width: 100%;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    padding: 40px;
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
}
.mapFormWrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    flex: 1;
}
.mapWrapper {
    flex: 1;
    min-width: 300px;
    height: 400px;
    border-radius: 20px;
    overflow: hidden;
}
.contactForm {
    flex: 1;
    min-width: 300px;
    background-color: #ffffff;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
.contactForm h2 {
    font-size: 1.8rem;
    margin-bottom: 10px;
    color: #333;
    border-bottom: 2px solid #a4acb7;
    padding-bottom: 5px;
}
.contactForm p {
    font-size: 1rem;
    margin-bottom: 20px;
    color: #555;
}
.inputGroup {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}
.inputGroup input,
textarea {
    flex: 1;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    font-size: 0.9rem;
}
textarea {
    width: 100%;
    height: 100px;
}
.submitButton {
    background-color: #cc8a94;
    color: #fff;
    padding: 15px 30px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
    font-size: 1rem;
    font-weight: bold;
}
.submitButton:hover {
    background-color: #ca717f;
}
.contactInfoWrapper {
    display: flex;
    width: 100%;
    margin-top: 20px;
    justify-content: space-between;
}
.contactInfo {
    /* flex: 1; */
    padding: 20px;
    color: #000;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 200px;
    width: 32%;
}
.contactInfo > div {
    margin-right: 8px;
}
</style>
