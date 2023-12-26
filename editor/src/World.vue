<script setup lang="ts">
import { ref } from "vue";
import Renderer from "./ccsr/renderer";
import { onMounted } from "vue";

const mapViewer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (mapViewer.value) {
    Renderer.addView(mapViewer.value);
  }
});
</script>

<template>
  <div ref="mapViewer" id="map-viewer"></div>
</template>

<style scoped>
#map-viewer {
  background-color: beige;
  width: 100%;
  height: 100%;
}
</style>
