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
  <v-row no-gutters style="height: 100%">
    <v-col cols="6" style="background-color: orange; overflow: auto">
      {{ maps.length }}
      <!-- Content for the left half goes here -->
    </v-col>
    <v-col cols="6" style="background-color: blue">
      <!-- Content for the right half goes here -->
    </v-col>
  </v-row>
</template>

<style scoped></style>
