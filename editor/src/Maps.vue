<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";
import { ref } from "vue";
const store = useStore();
const maps = computed(() => {
  return store.project.maps.map((x) => x.filename);
});

const tab = ref("one");
</script>

<template>
  <v-card style="height: 100%">
    <v-tabs v-model="tab">
      <v-tab value="one">Item One</v-tab>
      <v-tab value="two">Item Two</v-tab>
      <v-tab value="three">Item Three</v-tab>
    </v-tabs>
    <v-card-text class="h-100">
      <v-window v-model="tab">
        <v-window-item value="one"> One </v-window-item>
        <v-window-item value="two"> Two </v-window-item>
        <v-window-item value="three"> Three </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
