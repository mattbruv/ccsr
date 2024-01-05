<script setup lang="ts">
import { useStore } from "../../store";
import { storeToRefs } from "pinia";
import { MapEditorTab } from "./types";
import Overview from "./Overview.vue";

const store = useStore();
</script>

<template>
  <v-tabs v-model="store.UI.mapEditor.selectedTab">
    <v-tab :value="MapEditorTab.Overview">Overview</v-tab>
    <v-tab :value="MapEditorTab.Objects">All Objects</v-tab>
    <v-tab :value="MapEditorTab.ObjectEditor">Object Editor</v-tab>
  </v-tabs>
  <v-window v-model="store.UI.mapEditor.selectedTab">
    <v-window-item :value="MapEditorTab.Overview"><Overview /></v-window-item>
  </v-window>
</template>

<style scoped></style>
