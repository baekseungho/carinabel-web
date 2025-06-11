<template>
    <div class="memberManage">
        <div class="toggleGroup">
            <button :class="{ active: period === '전체' }" @click="setPeriod('전체')">전체</button>
            <button :class="{ active: period === '전월' }" @click="setPeriod('전월')">전월</button>
            <button :class="{ active: period === '당월' }" @click="setPeriod('당월')">당월</button>
        </div>

        <div class="orgChart">
            <!-- 상단 노드 (내 추천인) -->
            <div class="nodeWrapper parentWrapper">
                <!-- <div class="connector-vertical top"></div> -->
                <div v-if="network.parent" class="node parent">
                    <strong>{{ network.parent?.fullName }}</strong>
                    <div>{{ network.parent?.memberId }}</div>
                    <div>{{ network.parent?.membershipLevel }}</div>
                </div>
            </div>

            <!-- 내 정보 -->
            <div class="nodeWrapper centerWrapper">
                <div class="connector-vertical bottom"></div>
                <div class="node center">
                    <strong>{{ network.center?.fullName }}</strong>
                    <div>{{ network.center?.memberId }}</div>
                    <div>{{ network.center?.membershipLevel }}</div>
                    <div>
                        매출:
                        {{ formatPrice(network.center?.purchaseAmount) }}원
                    </div>
                </div>
            </div>

            <!-- 내가 추천한 사람들 -->
            <div class="childContainerWithLines" v-if="network.children.length">
                <!-- 수평 연결선 -->
                <div class="connector-horizontal"></div>

                <!-- 각각의 추천인 노드 -->
                <div v-for="child in network.children" :key="child._id" class="childNodeWrapper">
                    <!-- 수직 연결선 -->
                    <div class="connector-vertical top"></div>

                    <!-- 추천인 노드 박스 -->
                    <div class="node child">
                        <strong>{{ child.fullName }}</strong>
                        <div>{{ child?.memberId }}</div>
                        <div>{{ child?.membershipLevel }}</div>
                        <div>매출: {{ formatPrice(child.purchaseAmount) }}원</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import UserService from "@/api/UserService";

const network = ref({ center: {}, parent: null, children: [] });
const period = ref("전체");
const user = JSON.parse(localStorage.getItem("user"));
const token = JSON.parse(localStorage.getItem("user")).token;

const fetchNetwork = () => {
    if (!user?._id) return;
    UserService.getUserNetwork(token, user._id, period.value)
        .then((response) => {
            console.log(response);
            network.value = response.data;
            if (response.data.token) {
                user.token = response.data.token;
                localStorage.setItem("user", JSON.stringify(user));
            }

            console.log("✅ 조직도 로드:", response.data);
        })
        .catch((error) => {
            console.error("❌ 조직도 로드 실패:", error);
        });
};

const setPeriod = (val) => {
    period.value = val;
    fetchNetwork();
};

const formatPrice = (val) => val?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

onMounted(fetchNetwork);
</script>

<style scoped>
.memberManage {
    padding: 30px 30px 30px 0px;
    animation: fadeIn 0.5s ease;
}
.toggleGroup {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}
.toggleGroup button {
    padding: 10px 20px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
    border-radius: 8px;
}
.toggleGroup .active {
    background-color: #cc8a94;
    color: white;
    font-weight: bold;
}
.orgChart {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.node {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
    margin: 16px 0;
    min-width: 240px;
    border: 1.5px solid rgba(0, 0, 0, 0.08);
    transition: border-color 0.2s;
}
.node:hover {
    border-color: #cc8a94;
    box-shadow: 0 5px 20px rgba(204, 138, 148, 0.15);
}
.childContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
}
.parent {
    background: #999;
    color: #fff;
}
.center {
    background: #cc8a94;
    color: #fff;
}
.child {
    background: #f2f2f2;
}

/* 노드 위/아래 수직선 */
.connector-vertical {
    width: 2px;
    height: 20px;
    background-color: #ccc;
    margin: 0 auto;
}

.connector-vertical.top {
    margin-bottom: -10px;
}

.connector-vertical.bottom {
    margin-top: -10px;
}

/* 자식 노드 그룹 수평 연결선 */
.childContainerWithLines {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 30px;
    flex-wrap: wrap;
}

.childContainerWithLines .childNodeWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 16px;
    position: relative;
}

.connector-horizontal {
    position: absolute;
    top: 10px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #ccc;
    z-index: 0;
}
</style>
