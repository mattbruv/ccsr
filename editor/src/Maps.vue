<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";
const store = useStore();

const maps = computed(() => store.gameMaps);
</script>

<template>
  <div v-for="foo of maps">{{ foo.name }}</div>
  <div style="background-color: red; width: 1000px">foo</div>
  <div>bar</div>
</template>

<style scoped>
.blah {
  background-color: rebeccapurple;
  overflow: scroll;
  height: 90%;
  max-height: 90%;
}
</style>
