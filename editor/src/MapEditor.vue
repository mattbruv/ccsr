<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "./store";
import { VDataTable } from "vuetify/labs/components";
import { storeToRefs } from "pinia";
import { GameMap } from "./ccsr/renderer/types";
import { computed } from "vue";
import { Ref } from "vue";
import { watch } from "vue";

const store = useStore();
const { gameMaps, gameObjects, imageFiles } = storeToRefs(store);
</script>

<template>
  <v-container>
    <div>Hey</div>
  </v-container>
</template>

<style scoped></style>
