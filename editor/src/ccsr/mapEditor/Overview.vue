<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../../store";

const store = useStore();
const { gameMaps, gameObjects } = storeToRefs(store);
</script>

<template>
  <v-container>
    <div>{{ gameMaps.length }}</div>
  </v-container>
</template>

<style scoped></style>
