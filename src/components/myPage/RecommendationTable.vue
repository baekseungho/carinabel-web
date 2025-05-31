<template>
  <div class="recommendTable">
    <div class="header">
      <h2>추천 및 구매 통계</h2>
      <!-- <p class="sub">
                ※ 추천 기준일은 <strong>2022년 2월 7일</strong> 이후, 구매 기준일은
                <strong>2022년 1월 25일</strong> 이후입니다.
            </p> -->

      <!-- 📆 월 선택 드롭다운 -->
      <div class="monthFilter">
        <label for="monthSelect">월 선택:</label>
        <select id="monthSelect" v-model="selectedMonth" class="customSelect">
          <option value="전체">전체</option>
          <option v-for="stat in availableMonths" :key="stat" :value="stat">
            {{ stat }}
          </option>
        </select>
      </div>
    </div>

    <table v-if="stats">
      <thead>
        <tr>
          <th>년월</th>
          <th>당월 신규 추천인 수</th>
          <th>당월 구매 금액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stat in filteredStats" :key="stat.yearMonth">
          <td>{{ stat.yearMonth }}</td>
          <td>{{ stat.monthlyRefCount }}명</td>
          <td>{{ formatPrice(stat.monthlyPurchase) }}원</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>총 추천인 수</th>
          <th colspan="2">{{ stats.totalRefCount }}명</th>
        </tr>
        <tr>
          <th>총 누적 구매 금액</th>
          <th colspan="2">{{ formatPrice(stats.totalPurchase) }}원</th>
        </tr>
      </tfoot>
    </table>

    <div v-else class="loadingText">📡 데이터를 불러오는 중입니다...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import UserService from "@/api/UserService";

const stats = ref(null);
const selectedMonth = ref("전체");

const token = JSON.parse(localStorage.getItem("user"))?.token;

function formatPrice(price) {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ✅ 사용 가능한 월 목록
const availableMonths = computed(() =>
  stats.value
    ? [...new Set(stats.value.stats.map((s) => s.yearMonth))].reverse()
    : []
);

// ✅ 필터링된 리스트
const filteredStats = computed(() => {
  if (!stats.value) return [];
  if (selectedMonth.value === "전체") {
    return stats.value.stats.slice().reverse();
  }
  return stats.value.stats.filter((s) => s.yearMonth === selectedMonth.value);
});

onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?._id) return;

  UserService.getUserStats(user._id, token)
    .then((response) => {
      stats.value = response.data;

      if (response.data.token) {
        user.token = response.data.token;
        localStorage.setItem("user", JSON.stringify(user));
      }

      console.log("✅ 추천 통계 로드 완료:", response.data);
    })
    .catch((error) => {
      console.error("❌ 추천 통계 로드 실패:", error);
    });
});
</script>

<style scoped>
.recommendTable {
  background-color: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.header {
  margin-bottom: 20px;
}

.header h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.sub {
  font-size: 14px;
  color: #d9534f;
}

.monthFilter {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}

.monthFilter label {
  font-weight: 600;
  color: #333;
}

.customSelect {
  appearance: none;
  background-color: #fefefe;
  border: 2px solid #cc8a94;
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.customSelect:hover {
  border-color: #ca717f;
  background-color: #fff0f3;
}

.customSelect:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(204, 138, 148, 0.3);
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

thead {
  background-color: #333;
  color: #fff;
}

th,
td {
  padding: 14px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}

tfoot {
  background-color: #f0f0f0;
  font-weight: bold;
}

.loadingText {
  text-align: center;
  padding: 30px;
  font-size: 18px;
  color: #999;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
