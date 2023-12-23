<script setup lang="ts">
import { useStore } from "./store";
const store = useStore();

const maps = store.project.maps;
</script>

<template>
  <v-container>
    <div>{{ maps.length }}</div>
  </v-container>
</template>

<style scoped></style>
