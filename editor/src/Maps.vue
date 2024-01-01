<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";
const store = useStore();

const maps = computed(() => store.gameMaps);
</script>

<template>
  <div>
    <div v-for="map of maps"></div>
    <div>foo</div>
    <div>bar</div>
  </div>
</template>

<style scoped></style>
