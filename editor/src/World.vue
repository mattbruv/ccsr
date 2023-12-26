<script setup lang="ts">
import { ref } from "vue";
import Renderer from "./ccsr/renderer";
import { onMounted } from "vue";

const mapViewer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (mapViewer.value) {
    Renderer.addView(mapViewer.value);

    // Add resize listener
    new ResizeObserver(() => {
      console.log("resize");
      Renderer.resizeTo(mapViewer.value!);
    }).observe(mapViewer.value);
  }
});
</script>

<template>
  <div ref="mapViewer" id="map-viewer"></div>
</template>

<style scoped>
#map-viewer {
  max-height: 100%;
}
</style>
