<script setup lang="ts">
import { useStore } from "./store";
import { VDataTable } from "vuetify/labs/components";
const store = useStore();

type MapTableData = {
  name: string;
  renderBorder: boolean;
  renderGrid: boolean;
  renderOutOfBounds: boolean;
};

const items = [
  {
    foo: "bar",
    baz: "dog",
  },
  {
    foo: "rar",
    baz: "bog",
  },
];
</script>

<template>
  <div>
    <v-data-table :items="items"></v-data-table>
  </div>
</template>

<style scoped></style>
