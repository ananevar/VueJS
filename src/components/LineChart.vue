<template>
  <div class="bg-white rounded-xl shadow p-6">
    <h2 class="text-2xl font-semibold mb-4">Статистика {{ displayName }}</h2>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { Chart } from 'chart.js/auto';
import axios from 'axios';

const props = defineProps({
  country: String,
  region: String,
});

const chartRef = ref(null);
let chartInstance = null;

const displayName = computed(() => {
  if (props.region) return props.region;
  if (props.country) return props.country;
  return 'Мира';
});

const fetchData = async () => {
  let url = '';

  if (props.region && props.country === 'Russia') {
    // Тут можно добавить API для регионов России, если будет
    // Пока покажем данные страны
    url = `https://disease.sh/v3/covid-19/historical/${props.country}?lastdays=30`;
  } else if (props.country) {
    url = `https://disease.sh/v3/covid-19/historical/${props.country}?lastdays=30`;
  } else {
    url = 'https://disease.sh/v3/covid-19/historical/all?lastdays=30';
  }

  try {
    const res = await axios.get(url);
    const data = props.country ? res.data.timeline || res.data : res.data;

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(chartRef.value, {
      type: 'line',
      data: {
        labels: Object.keys(data.cases),
        datasets: [
          {
            label: 'Заражения',
            data: Object.values(data.cases),
            borderColor: 'rgb(255, 99, 132)',
            fill: false,
          },
          {
            label: 'Смерти',
            data: Object.values(data.deaths),
            borderColor: 'rgb(54, 162, 235)',
            fill: false,
          },
          {
            label: 'Выздоровевшие',
            data: Object.values(data.recovered),
            borderColor: 'rgb(75, 192, 192)',
            fill: false,
          }
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  } catch (error) {
    console.error('Ошибка при загрузке данных', error);
  }
};

watch([() => props.country, () => props.region], fetchData, { immediate: true });
</script>

<style scoped>
canvas {
  width: 100%;
  height: 400px;
}
</style>
