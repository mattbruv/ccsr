<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../../store";

const store = useStore();
const { gameMaps, gameObjects, selectedMap } = storeToRefs(store);
</script>

<template>
  <v-container>
    <v-autocomplete
      v-model="store.selectedMapName"
      :items="gameMaps.map((x) => x.name)"
    >
    </v-autocomplete>
    {{ selectedMap }}
    <br />
    hey
  </v-container>
</template>

<style scoped></style>
