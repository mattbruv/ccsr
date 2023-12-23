<script setup lang="ts">
//import { useStore } from "./store";
import testMap, { parseMap, lingoValueToString } from "./parser/parser";

const res = parseMap(testMap);
const test = lingoValueToString(res.value);
console.log(test);
</script>

<template>
  <v-container>
    <div>Hi mom</div>
  </v-container>
</template>

<style scoped></style>
