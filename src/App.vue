<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-3xl font-bold text-center mb-6">COVID-19 Dashboard</h1>

    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <div class="flex-1">
        <label>Выберите страну:</label>
        <select v-model="selectedCountry" class="w-full border rounded p-2">
          <option v-for="c in countryList" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
    </div>

    <div v-if="selectedCountry">
      <LineChart :country="selectedCountry" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LineChart from './components/LineChart.vue';

const selectedCountry = ref('Russia');
const countryList = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get('https://disease.sh/v3/covid-19/countries');
    countryList.value = res.data.map(c => c.country).sort();
  } catch (e) {
    console.error('Ошибка загрузки списка стран:', e);
  }
});
</script>
