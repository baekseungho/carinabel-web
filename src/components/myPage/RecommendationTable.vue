<template>
    <div class="recommendTable">
        <p class="notice">
            ※ 추천 기준일은 <strong>2022년 2월 7일</strong> 이후, 구매 기준일은
            <strong>2022년 1월 25일</strong> 이후입니다.
        </p>
        <table>
            <thead>
                <tr>
                    <th>년월</th>
                    <th>당월신규추천</th>
                    <th>신규추천누적</th>
                    <th>당월구매금액</th>
                    <th>구매금액누적</th>
                    <th>구매포인트누적</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2025-04</td>
                    <td>9명</td>
                    <td>9명</td>
                    <td>210,000원</td>
                    <td>210,000원</td>
                    <td>0P</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.recommendTable {
    background-color: #fff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.notice {
    font-size: 14px;
    color: #d9534f;
    margin-bottom: 15px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    background-color: #333;
    color: #fff;
}

th,
td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

tbody tr:hover {
    background-color: #f9f9f9;
}
</style>
