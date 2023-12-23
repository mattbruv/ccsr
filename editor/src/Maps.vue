<script setup lang="ts">
import { useStore } from "./store";
const store = useStore();
</script>

<template>
  <v-container>
    <div>{{ store.project.maps.length }}</div>
  </v-container>
</template>

<style scoped></style>
