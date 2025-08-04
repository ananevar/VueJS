
<template>
  <main class="main-layout flex flex-row w-full h-screen px-8 mx-8">
    <section class="panel-main w-3/4 min-h-screen">
      <div class="panel-main-scroll" style="gap: 18px;">
        <h1 class="header-main text-4xl font-extrabold mb-2">Covid19: статистика</h1>
        <LineChart style="flex:1; min-height:320px;" :selected-country.sync="selectedCountry" />
      </div>
    </section>
    <aside class="aside-main">
      <div class="panel-main-light">
        <h2 class="header-main-light text-2xl font-bold mb-4">Статистика по странам</h2>
        <div style="margin-bottom: 12px; max-width: 350px;">
          <input
            v-model="searchTable"
            type="text"
            placeholder="Поиск по стране..."
            class="p-2 border rounded w-full"
            style="box-sizing: border-box;"
          />
        </div>
        <StatsTable :search="searchTable" :sort-key.sync="sortKey" :sort-order.sync="sortOrder" :selected-country.sync="selectedCountry" />
      </div>
    </aside>
  </main>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
const searchTable = ref('');
const sortKey = ref('cases');
const sortOrder = ref('desc');
const selectedCountry = ref('Russia');
onMounted(() => {
  const saved = localStorage.getItem('table_search');
  if (saved) searchTable.value = saved;
  const savedKey = localStorage.getItem('table_sortKey');
  if (savedKey) sortKey.value = savedKey;
  const savedOrder = localStorage.getItem('table_sortOrder');
  if (savedOrder) sortOrder.value = savedOrder;
  const savedCountry = localStorage.getItem('selectedCountry');
  if (savedCountry) selectedCountry.value = savedCountry;
});
watch(searchTable, v => localStorage.setItem('table_search', v));
watch(sortKey, v => localStorage.setItem('table_sortKey', v));
watch(sortOrder, v => localStorage.setItem('table_sortOrder', v));
watch(selectedCountry, v => localStorage.setItem('selectedCountry', v));
import LineChart from './components/LineChart.vue';
import StatsTable from './components/StatsTable.vue';
</script>
