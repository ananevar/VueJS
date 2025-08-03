<template>
  <main class="main-layout flex flex-row w-full h-screen px-8 mx-8">
    <!-- Левая панель: выбор страны + график (3/4) -->
    <section class="panel flex flex-col gap-6 w-3/4 min-h-screen">
      <h1 class="text-4xl font-extrabold mb-4 text-white drop-shadow-[0_2px_16px_rgba(0,198,255,0.45)]">Covid19: вспышка</h1>
      <div class="mb-4 bg-white/5 rounded-xl shadow-lg p-4">
        <label for="country-select" class="block mb-2 text-gray-200 font-semibold">Выберите страну:</label>
        <select id="country-select" v-model="selectedCountry" class="w-full bg-white/10 border border-blue-400 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-400 transition">
          <option v-for="c in countryList" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <LineChart :country="selectedCountry" />
    </section>

    <aside class="flex flex-col w-1/4 min-h-screen">
      <div class="bg-white rounded-2xl shadow-2xl p-6 flex-1 flex flex-col">
        <h2 class="text-2xl font-bold mb-4 text-cyan-700 drop-shadow">Статистика по странам</h2>
        <StatsTable :tableData="tableData" />
      </div>
    </aside>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LineChart from './components/LineChart.vue';
import StatsTable from './components/StatsTable.vue';

const selectedCountry = ref('Russia');
const countryList = ref([]);
const tableData = ref([]);
const stats = ref({ cases: 0, deaths: 0, recovered: 0, updated: 0 });

onMounted(async () => {
  try {
    const res = await axios.get('https://disease.sh/v3/covid-19/countries');
    countryList.value = res.data.map(c => c.country).sort();

    tableData.value = res.data.sort((a, b) => b.cases - a.cases);

    const globalRes = await axios.get('https://disease.sh/v3/covid-19/all');
    stats.value = globalRes.data;
  } catch (e) {
    console.error('Ошибка загрузки данных:', e);
  }
});
</script>
