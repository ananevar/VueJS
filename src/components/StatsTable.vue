<template>
  <div class="stats-table">
    <table class="w-full text-base">
      <thead
        class="stats-table-header"
        style="position: sticky; top: 0; z-index: 2; background: #fff"
      >
        <tr>
          <th
            class="text-left p-3 font-bold cursor-pointer select-none"
            @click="sortBy('country')"
          >
            Страна
            <span v-if="sortKey === 'country'">{{
              sortOrder === "asc" ? "▲" : "▼"
            }}</span>
          </th>
          <th
            class="text-left p-3 font-bold cursor-pointer select-none"
            @click="sortBy('cases')"
          >
            Случаи
            <span v-if="sortKey === 'cases'">{{
              sortOrder === "asc" ? "▲" : "▼"
            }}</span>
          </th>
          <th
            class="text-left p-3 font-bold cursor-pointer select-none"
            @click="sortBy('recovered')"
          >
            Выздоровело
            <span v-if="sortKey === 'recovered'">{{
              sortOrder === "asc" ? "▲" : "▼"
            }}</span>
          </th>
          <th
            class="text-left p-3 font-bold cursor-pointer select-none"
            @click="sortBy('deaths')"
          >
            Смертей
            <span v-if="sortKey === 'deaths'">{{
              sortOrder === "asc" ? "▲" : "▼"
            }}</span>
          </th>
        </tr>
      </thead>
    </table>
    <div class="overflow-auto" style="max-height: 60vh">
      <table class="w-full text-base">
        <tbody>
          <tr
            v-for="row in filteredData"
            :key="row.country"
            class="stats-table-row"
          >
            <td class="p-3 font-semibold">{{ countryRu(row.country) }}</td>
            <td class="p-3">{{ row.cases.toLocaleString() }}</td>
            <td
              class="p-3"
              style="color: var(--main-success); font-weight: bold"
            >
              {{ row.recovered.toLocaleString() }}
            </td>
            <td
              class="p-3"
              style="color: var(--main-danger); font-weight: bold"
            >
              {{ row.deaths.toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { countryMap } from "../utils/country-ru-map.js";

function countryRu(name) {
  return countryMap[name] || name;
}

const tableData = ref([]);
const props = defineProps({
  search: { type: String, default: "" },
  sortKey: { type: String, default: "cases" },
  sortOrder: { type: String, default: "desc" },
});
const emit = defineEmits(["update:sortKey", "update:sortOrder"]);

const sortKey = ref(props.sortKey);
const sortOrder = ref(props.sortOrder);

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = key === "country" ? "asc" : "desc";
  }
  emit("update:sortKey", sortKey.value);
  emit("update:sortOrder", sortOrder.value);
};

const sortedData = computed(() => {
  const arr = [...tableData.value];
  arr.sort((a, b) => {
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];
    if (sortKey.value === "country") {
      valA = countryRu(valA || "");
      valB = countryRu(valB || "");
      return sortOrder.value === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
      return sortOrder.value === "asc" ? valA - valB : valB - valA;
    }
  });
  return arr;
});

const filteredData = computed(() => {
  if (!props.search.trim()) return sortedData.value;
  const q = props.search.trim().toLowerCase();
  return sortedData.value.filter((row) =>
    countryRu(row.country).toLowerCase().includes(q)
  );
});

onMounted(async () => {
  try {
    const res = await axios.get("https://disease.sh/v3/covid-19/countries");
    tableData.value = res.data.sort((a, b) => b.cases - a.cases);
  } catch (e) {
    tableData.value = [];
  }
});

watch(sortKey, (v) => emit("update:sortKey", v));
watch(sortOrder, (v) => emit("update:sortOrder", v));
</script>
