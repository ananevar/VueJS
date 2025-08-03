<template>
  <div class="overflow-auto rounded-xl bg-white">
    <table class="w-full text-base text-gray-800">
      <thead class="bg-gray-100">
        <tr class="border-b border-gray-300">
          <th class="text-left p-3 font-bold">Страна</th>
          <th class="text-left p-3 font-bold">Случаи</th>
          <th class="text-left p-3 font-bold">Выздоровело</th>
          <th class="text-left p-3 font-bold">Смертей</th>
          <!-- <th class="text-left p-3 font-bold">Новые</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData" :key="row.country" class="border-b border-gray-200 hover:bg-blue-50 transition">
          <td class="p-3 font-semibold">{{ row.country }}</td>
          <td class="p-3">{{ row.cases.toLocaleString() }}</td>
          <td class="p-3 text-green-600 font-bold">{{ row.recovered.toLocaleString() }}</td>
          <td class="p-3 text-red-600 font-bold">{{ row.deaths.toLocaleString() }}</td>
          <!-- <td class="p-3 text-yellow-600 font-bold">{{ row.todayCases }}</td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  tableData: {
    type: Array,
    required: true
  }
});
</script>
