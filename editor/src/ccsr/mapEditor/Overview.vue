<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../../store";
import { computed } from "vue";

const store = useStore();
const { gameMaps, gameObjects } = storeToRefs(store);

const selectedMap = computed(() =>
  gameMaps.value.find((x) => x.name === store.mapEditor.selectedMap)
);

const mapObjects = computed(() =>
  gameObjects.value.filter((x) => x.mapName === store.mapEditor.selectedMap)
);

function test() {}
</script>

<template>
  <v-container>
    <v-autocomplete
      v-model="store.mapEditor.selectedMap"
      :items="gameMaps.map((x) => x.name)"
    >
    </v-autocomplete>
    {{ selectedMap }}
    <br />
    {{ mapObjects[0] }}
    hey
    {{
      store.gameObjects.find(
        (x) => x.mapName === store.mapEditor.selectedMap
      )[0]
    }}
  </v-container>
</template>

<style scoped></style>
