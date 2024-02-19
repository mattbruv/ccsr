<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../../store";
import { computed } from "vue";
import { lingoValueToString } from "../parser/print";
import { mapObjectToLingo } from "../game/toLingo";
import { GameObject } from "../renderer/types";

const store = useStore();
const { gameMaps, gameObjects, selectedMap } = storeToRefs(store);

const selectedObject = computed(() => {
  return gameObjects.value.find((x) => x.id === store.selectedObjectId);
});

const json = computed((): string => {
  if (!selectedObject.value) return "";
  const lingoObject = mapObjectToLingo(selectedObject.value.data);
  return lingoValueToString(lingoObject, true, true);
});

const memberTextures = computed(() => {
  return store.imageFiles
    .map((x) => x.filename)
    .sort((a, b) => a.localeCompare(b));
});

function render() {
  store.render();
}
</script>

<template>
  <v-container>
    <div v-if="!selectedObject">No object selected!</div>
    <div v-else>
      {{ selectedObject.id }}
      <v-autocomplete
        :items="memberTextures"
        v-model="selectedObject.data.member"
        @update:model-value="render"
        label="Member Texture"
      >
      </v-autocomplete>
      <div>
        <code>
          {{ json }}
        </code>
      </div>
    </div>
  </v-container>
</template>

<style scoped></style>
