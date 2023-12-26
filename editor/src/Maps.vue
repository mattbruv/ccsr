<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";
import { ref } from "vue";
const store = useStore();
const maps = computed(() => {
  return store.project.maps.map((x) => x.filename);
});

enum Tabs {
  Maps,
  Collision,
  Foo,
}

const tab = ref(Tabs.Maps);
</script>

<template>
  <v-card style="height: 100%">
    <v-tabs v-model="tab">
      <v-tab :value="Tabs.Maps">Maps</v-tab>
      <v-tab :value="Tabs.Collision">Collision</v-tab>
      <v-tab :value="Tabs.Foo">Foo</v-tab>
    </v-tabs>
    <v-card-text class="h-100">
      <v-window v-model="tab">
        <v-window-item :value="Tabs.Maps"> Maps </v-window-item>
        <v-window-item :value="Tabs.Collision"> Collision </v-window-item>
        <v-window-item :value="Tabs.Foo"> Foo </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
