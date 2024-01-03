<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "./store";
import { VDataTable } from "vuetify/labs/components";
import { storeToRefs } from "pinia";
import { GameMap } from "./ccsr/renderer/types";
import { computed } from "vue";

const store = useStore();
const { gameMaps, gameObjects } = storeToRefs(store);

const search = ref("");
const headers = [
  {
    align: "start",
    key: "name",
    sortable: true,
    title: "Map",
  },
  { key: "objects", title: "Objects" },
  { key: "oob", title: "Render OOB" },
];

const foo = computed(() => gameMaps.value[0]);
</script>

<template>
  {{ foo }}
  <v-card flat title="Maps">
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        single-line
        variant="outlined"
        hide-details
      >
      </v-text-field>
    </template>
    <v-data-table :headers="headers" :items="gameMaps" :search="search">
      <template v-slot:item="{ item }: { item: GameMap }">
        <tr>
          <td>{{ item.name }}</td>
          <td>
            <v-checkbox
              :v-bind="item.renderSettings.renderOutOfBounds"
            ></v-checkbox>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped></style>
