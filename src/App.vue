<template>
  <div class="min-h-screen bg-gray-100 p-6 max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">COVID-19 Dashboard</h1>

    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-center gap-4">
      <div>
        <label for="country" class="block mb-1 font-semibold text-gray-700">Выберите страну:</label>
        <select id="country" v-model="selectedCountry" @change="onCountryChange" class="border rounded p-2 w-60">
          <option value="">Все страны</option>
          <option v-for="c in countries" :key="c.country" :value="c.country">{{ c.country }}</option>
        </select>
      </div>

      <div v-if="selectedCountry === 'Russia'">
        <label for="region" class="block mb-1 font-semibold text-gray-700">Выберите регион:</label>
        <select id="region" v-model="selectedRegion" class="border rounded p-2 w-60">
          <option value="">Все регионы</option>
          <option v-for="r in regions" :key="r.province" :value="r.province">{{ r.province }}</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <LineChart :country="selectedCountry" :region="selectedRegion" />
      <WorldMap :country="selectedCountry" :region="selectedRegion" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import LineChart from './components/LineChart.vue';
import WorldMap from './components/WorldMap.vue';

const countries = ref([]);
const regions = ref([]);
const selectedCountry = ref('');
const selectedRegion = ref('');

const fetchCountries = async () => {
  const res = await axios.get('https://disease.sh/v3/covid-19/countries');
  countries.value = res.data.sort((a, b) => a.country.localeCompare(b.country));
};

const fetchRegions = async () => {
  // Для России API disease.sh не предоставляет регионы, используем отдельный запрос:
  if (selectedCountry.value === 'Russia') {
    // Получаем данные по регионам России
    // disease.sh не предоставляет, используем https://covid19.mathdro.id/api/ или свой набор
    const res = await axios.get('https://api.covid19tracking.narrativa.com/api/regions');
    // Вариант для учебного примера - заглушка с регионами
    // Если API нет, можно захардкодить регионы
    // regions.value = res.data.regions.filter(r => r.country === 'Russia');
    // Для простоты сделаем регионы вручную:
    regions.value = [
      { province: 'Moscow' },
      { province: 'Saint Petersburg' },
      { province: 'Novosibirsk' },
      { province: 'Krasnodar Krai' },
      { province: 'Tatarstan' },
    ];
  } else {
    regions.value = [];
    selectedRegion.value = '';
  }
};

const onCountryChange = () => {
  fetchRegions();
  selectedRegion.value = '';
};

onMounted(fetchCountries);
watch(selectedCountry, fetchRegions);
</script>

<style scoped>
select {
  background-color: white;
}
</style>
