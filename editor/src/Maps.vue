<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";
const store = useStore();
const maps = computed(() => {
  return store.project.maps.map((x) => x.filename);
});
</script>

<template>
  <v-container>
    <div>{{ store.project.maps.length }}</div>
    <div v-for="data in maps">{{ data }}</div>
  </v-container>
</template>

<style scoped></style>
