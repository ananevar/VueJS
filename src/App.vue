
<template>
  <main class="main-layout flex flex-row w-full h-screen px-8 mx-8">
    <section class="panel-main w-3/4 min-h-screen">
      <div class="panel-main-scroll" style="gap: 18px;">
        <h1 class="header-main text-4xl font-extrabold mb-2">Covid19: вспышка</h1>
        <LineChart style="flex:1; min-height:320px;" />
      </div>
    </section>
    <aside class="aside-main">
      <div class="panel-main-light">
        <h2 class="header-main-light text-2xl font-bold mb-4">Статистика по странам</h2>
        <StatsTable />
      </div>
    </aside>
  </main>
</template>


<script setup>
import LineChart from './components/LineChart.vue';
import StatsTable from './components/StatsTable.vue';
</script>
