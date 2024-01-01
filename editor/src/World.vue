<script setup lang="ts">
import { ref } from "vue";
import Renderer from "./ccsr/renderer/renderer";
import { onMounted } from "vue";

const mapViewer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  /*
  if (mapViewer.value) {

    Renderer.addView(mapViewer.value);

    // Add resize listener
    new ResizeObserver(() => {
      Renderer.resizeTo(mapViewer.value!);
    }).observe(mapViewer.value);
  }
  */
});
</script>

<template>
  <div ref="mapViewer" id="map-viewer">yo</div>
</template>

<style scoped>
#map-viewer {
}
</style>
./ccsr/renderer/renderer
