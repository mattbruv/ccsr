<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";
const store = useStore();

const maps = computed(() => store.gameMaps);
</script>

<template>
  <div v-for="foo of maps">{{ foo.name }}</div>
  <div>bar</div>
</template>

<style scoped></style>
