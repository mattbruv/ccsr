<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";
import { lingoValueToString } from "./ccsr/parser/parser";
import { reactive } from "vue";
import { ref } from "vue";
const store = useStore();
const maps = computed(() => {
  return store.project.maps.map((x) => x.filename);
});
const tab = ref("one");
</script>

<template>
  <v-row no-gutters style="height: 100%">
    <v-col cols="6" style="background-color: orange; overflow: auto">
      {{ maps.length }}
      <!-- Content for the left half goes here -->
    </v-col>
    <v-col cols="6" style="background-color: blue">
      <!-- Content for the right half goes here -->
      <v-card style="height: 100%">
        <v-tabs v-model="tab">
          <v-tab value="one">Item One</v-tab>
          <v-tab value="two">Item Two</v-tab>
          <v-tab value="three">Item Three</v-tab>
        </v-tabs>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="one"> One </v-window-item>
            <v-window-item value="two"> Two </v-window-item>
            <v-window-item value="three"> Three </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
