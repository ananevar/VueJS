<template>
  <div class="bg-white p-6 rounded-2xl shadow-2xl mt-4">
    <div class="mb-3">
      <label for="country-select" class="block mb-2 font-semibold">Выберите страну:</label>
      <select id="country-select" v-model="selectedCountry" class="w-full input-main">
        <option v-for="c in countryList" :key="c" :value="c">{{ countryRu(c) }}</option>
      </select>
    </div>
    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <div class="flex-1">
        <label class="block mb-2 text-gray-700 font-semibold">Начальная дата:</label>
        <input type="date" v-model="startDate" class="w-full bg-white border border-blue-300 text-gray-800 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition" @change="updateChart" />
      </div>
      <div class="flex-1">
        <label class="block mb-2 text-gray-700 font-semibold">Конечная дата:</label>
        <input type="date" v-model="endDate" class="w-full bg-white border border-blue-300 text-gray-800 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition" @change="updateChart" />
      </div>
    </div>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { countryMap } from '../country-ru-map.js';

Chart.register(...registerables);

const countryList = ref([]);
const selectedCountry = ref('Russia');

function countryRu(name) {
  return countryMap[name] || name;
}

const chartRef = ref(null);
let chartInstance = null;

const startDate = ref('');
const endDate = ref('');
let fullData = {
  dates: [],
  cases: [],
  deaths: [],
};

const toISO = (mdy) => {
  const [month, day, year] = mdy.split('/');
  return new Date(`20${year}`, month - 1, day).toISOString().slice(0, 10);
};

const fetchCountryList = async () => {
  try {
    const res = await axios.get('https://disease.sh/v3/covid-19/countries');
    countryList.value = res.data.map(c => c.country).sort();
  } catch (e) {
    countryList.value = ['Russia'];
  }
};

const fetchData = async () => {
  try {
    const res = await axios.get(`https://disease.sh/v3/covid-19/historical/${selectedCountry.value}?lastdays=all`);
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
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Заражения',
          data: cases,
          borderColor: '#2563eb',
          backgroundColor: '#60a5fa33',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Смерти',
          data: deaths,
          borderColor: '#dc2626',
          backgroundColor: '#fca5a533',
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#222', font: { weight: 'bold' } },
        },
      },
      scales: {
        x: {
          ticks: { color: '#222' },
          grid: { color: '#e5e7eb' },
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#222' },
          grid: { color: '#e5e7eb' },
        },
      },
    },
  });
};

const updateChart = () => {
  const startIndex = fullData.dates.indexOf(startDate.value);
  const endIndex = fullData.dates.indexOf(endDate.value);

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) return;

  const dates = fullData.dates.slice(startIndex, endIndex + 1);
  const cases = fullData.cases.slice(startIndex, endIndex + 1);
  const deaths = fullData.deaths.slice(startIndex, endIndex + 1);

  buildChart(dates, cases, deaths);
};

onMounted(() => {
  fetchCountryList();
  fetchData();
});
watch(selectedCountry, fetchData);
</script>
