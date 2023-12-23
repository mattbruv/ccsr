<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";
import { lingoValueToString } from "./ccsr/parser/parser";
const store = useStore();
const maps = computed(() => {
  return store.project.maps.map((x) => x.filename);
});
</script>

<template>
  <v-container>
    <div>{{ store.project.maps.length }}</div>
    <div>{{ lingoValueToString(store.project.maps[0].objectTree) }}</div>
  </v-container>
</template>

<style scoped></style>
