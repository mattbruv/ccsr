<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";
const store = useStore();
</script>

<template>
  <div id="map-viewer">
    {{ store.UI.global.showMapViewer }}
  </div>
</template>

<style scoped></style>
