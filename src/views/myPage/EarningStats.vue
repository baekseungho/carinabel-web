<template>
  <div class="recommendTable">
    <div class="header">
      <h2>마이페이지 > 수당관리</h2>

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
          <th>당월 수당 금액</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="stat in filteredStats"
          :key="stat.yearMonth"
          @click="openModal(stat.yearMonth)"
          class="clickableRow"
        >
          <td>{{ stat.yearMonth }}</td>
          <td>{{ formatPrice(stat.monthlyEarning) }}원</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>총 누적 수당</th>
          <th>{{ formatPrice(stats.totalEarning) }}원</th>
        </tr>
      </tfoot>
    </table>

    <div v-else class="loadingText">📡 수당 데이터를 불러오는 중입니다...</div>
  </div>
  <ReferralDetailModal
    :visible="isModalVisible"
    :yearMonth="selectedMonthDetail"
    :records="monthDetails"
    @close="isModalVisible = false"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import UserService from "@/api/UserService";
import ReferralDetailModal from "@/components/myPage/ReferralDetailModal.vue";

const stats = ref(null);
const selectedMonth = ref("전체");
const user = JSON.parse(localStorage.getItem("user"));
const token = user?.token;
const isModalVisible = ref(false);
const selectedMonthDetail = ref("");
const monthDetails = ref([]);

const availableMonths = computed(() => {
  if (!stats.value) return [];
  const uniqueMonths = new Set();
  const reversed = [];
  for (const stat of [...stats.value.stats].reverse()) {
    if (!uniqueMonths.has(stat.yearMonth)) {
      uniqueMonths.add(stat.yearMonth);
      reversed.push(stat.yearMonth);
    }
  }
  return reversed;
});

const filteredStats = computed(() => {
  if (!stats.value) return [];
  const filtered =
    selectedMonth.value === "전체"
      ? stats.value.stats.slice()
      : stats.value.stats.filter((s) => s.yearMonth === selectedMonth.value);
  // 중복 제거
  const unique = [];
  const seen = new Set();
  for (const stat of filtered) {
    if (!seen.has(stat.yearMonth)) {
      seen.add(stat.yearMonth);
      unique.push(stat);
    }
  }
  return unique;
});

const formatPrice = (num) =>
  num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const openModal = (yearMonth) => {
  selectedMonthDetail.value = yearMonth;
  isModalVisible.value = true;

  UserService.getReferralEarningsByMonth(user._id, yearMonth, token)
    .then((res) => {
      monthDetails.value = res.data;
    })
    .catch((err) => {
      console.error("❌ 수당 상세 로딩 실패:", err);
    });
};

onMounted(() => {
  if (!user?._id) return;
  UserService.getReferralStats(user._id, token)
    .then((res) => {
      stats.value = res.data;
    })
    .catch((err) => {
      console.error("❌ 수당 데이터 로드 실패:", err);
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
.clickableRow {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clickableRow:hover {
  background-color: #fdf2f4; /* 트렌디한 연한 분홍 계열 (카리나벨 테마톤) */
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
