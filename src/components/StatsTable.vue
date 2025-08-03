<template>
  <div class="overflow-auto stats-table">
    <table class="w-full text-base">
      <thead class="stats-table-header">
        <tr>
          <th class="text-left p-3 font-bold cursor-pointer select-none" @click="sortBy('country')">
            Страна
            <span v-if="sortKey === 'country'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th class="text-left p-3 font-bold cursor-pointer select-none" @click="sortBy('cases')">
            Случаи
            <span v-if="sortKey === 'cases'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th class="text-left p-3 font-bold cursor-pointer select-none" @click="sortBy('recovered')">
            Выздоровело
            <span v-if="sortKey === 'recovered'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th class="text-left p-3 font-bold cursor-pointer select-none" @click="sortBy('deaths')">
            Смертей
            <span v-if="sortKey === 'deaths'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in sortedData" :key="row.country" class="stats-table-row">
          <td class="p-3 font-semibold">{{ countryRu(row.country) }}</td>
          <td class="p-3">{{ row.cases.toLocaleString() }}</td>
          <td class="p-3" style="color: var(--main-success); font-weight: bold">{{ row.recovered.toLocaleString() }}</td>
          <td class="p-3" style="color: var(--main-danger); font-weight: bold">{{ row.deaths.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { countryMap } from '../country-ru-map.js';

function countryRu(name) {
  return countryMap[name] || name;
}

const tableData = ref([]);
const sortKey = ref('cases');
const sortOrder = ref('desc');

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = key === 'country' ? 'asc' : 'desc';
  }
};

const sortedData = computed(() => {
  const arr = [...tableData.value];
  arr.sort((a, b) => {
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];
    if (sortKey.value === 'country') {
      valA = countryRu(valA || '');
      valB = countryRu(valB || '');
      return sortOrder.value === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
      return sortOrder.value === 'asc' ? valA - valB : valB - valA;
    }
  });
  return arr;
});

onMounted(async () => {
  try {
    const res = await axios.get('https://disease.sh/v3/covid-19/countries');
    tableData.value = res.data.sort((a, b) => b.cases - a.cases);
  } catch (e) {
    tableData.value = [];
  }
});
</script>
