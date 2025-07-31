<template>
  <div class="bg-white rounded-xl shadow p-6">
    <h2 class="text-2xl font-semibold mb-4">Карта распространения COVID-19 {{ displayName }}</h2>
    <l-map :zoom="zoom" :center="center" style="height: 400px; width: 100%">
      <l-tile-layer :url="tileUrl" :attribution="attribution" />
      <l-circle-marker
        v-for="item in mapData"
        :key="item.key"
        :lat-lng="[item.lat, item.lng]"
        :radius="getRadius(item.cases)"
        color="red"
        fill-opacity="0.5"
      >
        <l-popup>
          <div>
            <strong>{{ item.name }}</strong><br />
            Заражений: {{ item.cases.toLocaleString() }}<br />
            Смертей: {{ item.deaths.toLocaleString() }}
          </div>
        </l-popup>
      </l-circle-marker>
    </l-map>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import axios from 'axios';
import {
  LMap,
  LTileLayer,
  LCircleMarker,
  LPopup
} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  country: String,
  region: String,
});

const countries = ref([]);
const regions = ref([]);

const mapData = ref([]);
const zoom = ref(2);
const center = ref([20, 0]);

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; OpenStreetMap contributors';

const getRadius = (cases) => Math.sqrt(cases) / 20;

const fetchCountries = async () => {
  const res = await axios.get('https://disease.sh/v3/covid-19/countries');
  countries.value = res.data;
};

const fetchRegions = async () => {
  // Пока нет официального API регионов для России в disease.sh,
  // тут пример с заглушкой — лучше заменить своим API.
  if (props.country === 'Russia') {
    regions.value = [
      { province: 'Moscow', lat: 55.75, lng: 37.62, cases: 500000, deaths: 9000 },
      { province: 'Saint Petersburg', lat: 59.93, lng: 30.33, cases: 300000, deaths: 6000 },
      { province: 'Novosibirsk', lat: 55.03, lng: 82.92, cases: 150000, deaths: 4000 },
      { province: 'Krasnodar Krai', lat: 45.03, lng: 38.98, cases: 120000, deaths: 3000 },
      { province: 'Tatarstan', lat: 55.79, lng: 49.12, cases: 110000, deaths: 2500 },
    ];
    mapData.value = regions.value.map(r => ({
      key: r.province,
      name: r.province,
      lat: r.lat,
      lng: r.lng,
      cases: r.cases,
      deaths: r.deaths,
    }));
    zoom.value = 4;
    center.value = [55.75, 37.62];
  } else if (props.country) {
    const countryData = countries.value.find(c => c.country === props.country);
    if (countryData) {
      mapData.value = [{
        key: countryData.country,
        name: countryData.country,
        lat: countryData.countryInfo.lat,
        lng: countryData.countryInfo.long,
        cases: countryData.cases,
        deaths: countryData.deaths,
      }];
      zoom.value = 4;
      center.value = [countryData.countryInfo.lat, countryData.countryInfo.long];
    }
  } else {
    // Мировая карта со всеми странами
    mapData.value = countries.value.map(c => ({
      key: c.country,
      name: c.country,
      lat: c.countryInfo.lat,
      lng: c.countryInfo.long,
      cases: c.cases,
      deaths: c.deaths,
    }));
    zoom.value = 2;
    center.value = [20, 0];
  }
};

watch(() => props.country, fetchRegions, { immediate: true });
</script>

<style scoped>
.l-map {
  width: 100%;
  height: 100%;
}
</style>
