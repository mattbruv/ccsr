<script setup lang="ts">
import { useStore } from "./store";

import { parseMap, lingoValueToString } from "./parser/parser";

const res = parseMap('[#test:"foo",           #fuck: "Off"]');
const test = lingoValueToString(res.value);
console.log(test);

const store = useStore();
</script>

<template>
  <v-container>
    <div>Hi mom</div>
  </v-container>
</template>

<style scoped></style>
