<template>
  <div>
    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <div class="flex-1">
        <label>Начальная дата:</label>
        <input type="date" v-model="startDate" class="w-full border rounded p-2" @change="updateChart" />
      </div>
      <div class="flex-1">
        <label>Конечная дата:</label>
        <input type="date" v-model="endDate" class="w-full border rounded p-2" @change="updateChart" />
      </div>
    </div>

    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const props = defineProps({
  country: {
    type: String,
    required: true,
  }
});

const chartRef = ref(null);
let chartInstance = null;

const startDate = ref('');
const endDate = ref('');
let fullData = {
  dates: [],
  cases: [],
  deaths: [],
};

// Функция для конвертации даты из M/D/YY в YYYY-MM-DD
const toISO = (mdy) => {
  const [month, day, year] = mdy.split('/');
  const iso = new Date(`20${year}`, month - 1, day).toISOString().slice(0, 10);
  return iso;
};

const fetchData = async () => {
  try {
    const res = await axios.get(`https://disease.sh/v3/covid-19/historical/${props.country}?lastdays=all`);
    const data = res.data.timeline || res.data;

    const dates = Object.keys(data.cases).map(toISO);

    fullData = {
      dates,
      cases: Object.values(data.cases),
      deaths: Object.values(data.deaths),
    };

    startDate.value = dates[0];
    endDate.value = dates[dates.length - 1];

    buildChart(dates, fullData.cases, fullData.deaths);
  } catch (err) {
    console.error('Ошибка при получении данных:', err);
  }
};

const buildChart = (labels, cases, deaths) => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Заражения',
          data: cases,
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'Смерти',
          data: deaths,
          borderColor: 'red',
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

const updateChart = () => {
  const startIndex = fullData.dates.findIndex(d => d === startDate.value);
  const endIndex = fullData.dates.findIndex(d => d === endDate.value);

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) return;

  const dates = fullData.dates.slice(startIndex, endIndex + 1);
  const cases = fullData.cases.slice(startIndex, endIndex + 1);
  const deaths = fullData.deaths.slice(startIndex, endIndex + 1);

  buildChart(dates, cases, deaths);
};

onMounted(fetchData);
watch(() => props.country, fetchData);
</script>
