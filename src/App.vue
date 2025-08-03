<template>
  <div class="min-h-screen bg-black text-white flex flex-row">
    <!-- Левая панель (3/4 ширины) -->
    <div class="flex-[3] p-4 overflow-auto">
      <h1 class="text-3xl font-bold mb-6">Covid19: вспышка</h1>

      <div class="mb-4">
        <label class="block mb-1 text-gray-300">Выберите страну:</label>
        <select v-model="selectedCountry" class="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded">
          <option v-for="c in countryList" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <LineChart :country="selectedCountry" />
    </div>

    <!-- Правая панель (1/4 ширины) -->
    <div class="flex-[1] bg-gray-900 p-4 rounded shadow overflow-auto">
      <h2 class="text-xl font-semibold mb-2">Статистика по странам</h2>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="text-left p-2">Страна</th>
            <th class="text-left p-2">Случаи</th>
            <th class="text-left p-2">Выздоровело</th>
            <th class="text-left p-2">Смертей</th>
            <th class="text-left p-2">Новые</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.country" class="border-b border-gray-800 hover:bg-gray-800">
            <td class="p-2">{{ row.country }}</td>
            <td class="p-2">{{ row.cases.toLocaleString() }}</td>
            <td class="p-2 text-green-400">{{ row.recovered.toLocaleString() }}</td>
            <td class="p-2 text-red-400">{{ row.deaths.toLocaleString() }}</td>
            <td class="p-2 text-yellow-400">+{{ row.todayCases }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LineChart from './components/LineChart.vue';

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
