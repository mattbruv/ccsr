<script setup lang="ts">
import Renderer from "./ccsr/renderer";

const foo = document.getElementById("map-viewer");
console.log(foo);
</script>

<template>
  <div ref="map-viewer" id="map-viewer"></div>
</template>

<style scoped>
#map-viewer {
  background-color: beige;
  width: 100%;
  height: 100%;
}
</style>
