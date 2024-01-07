<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../../store";
import { VDataTable } from "vuetify/labs/components";
import { computed } from "vue";

type ReadonlyHeaders = VDataTable["headers"];

const headers: ReadonlyHeaders = [
  {
    title: "Image",
  },
  {
    title: "Member",
    value: "data.member",
  },
  {
    title: "Type",
    value: "data.data.item.type",
  },
  {
    title: "Action",
  },
];

const store = useStore();
const { gameMaps, gameObjects, selectedMap } = storeToRefs(store);

const mapObjects = computed(() =>
  gameObjects.value.filter((x) => x.mapName === selectedMap.value?.name)
);
</script>

<template>
  <v-container>
    <v-data-table :headers="headers" :items="mapObjects"></v-data-table>
  </v-container>
</template>

<style scoped></style>
