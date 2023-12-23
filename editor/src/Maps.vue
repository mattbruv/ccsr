<script setup lang="ts">
import { useStore } from "./store";
const store = useStore();

const maps = store.project.maps;
</script>

<template>
  <v-container>
    <div>Hi mom</div>
  </v-container>
</template>

<style scoped></style>
