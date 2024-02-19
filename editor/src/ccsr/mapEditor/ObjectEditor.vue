<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../../store";
import { computed } from "vue";

const store = useStore();
const { gameMaps, gameObjects, selectedMap } = storeToRefs(store);

const selectedObject = computed(() => {
  return gameObjects.value.find((x) => x.id === store.selectedObjectId);
});
</script>

<template>
  <v-container>
    <div v-if="!selectedObject">No object selected!</div>
    <div v-else>{{ selectedObject.id }}</div>
  </v-container>
</template>

<style scoped></style>
