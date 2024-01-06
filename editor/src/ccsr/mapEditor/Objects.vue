<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../../store";
import { computed } from "vue";

const store = useStore();
const { gameMaps, gameObjects, selectedMap } = storeToRefs(store);
</script>

<template>
  <v-container>
    <div>objects</div>
  </v-container>
</template>

<style scoped></style>
