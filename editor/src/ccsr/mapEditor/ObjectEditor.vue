<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../../store";
import { computed } from "vue";
import { lingoValueToString } from "../parser/print";
import { mapObjectToLingo } from "../game/toLingo";

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
      <v-autocomplete
        :items="memberTextures"
        v-model="selectedObject.data.member"
        @update:model-value="render"
        label="Member Texture"
      >
      </v-autocomplete>

      <v-row>
        <v-col cols="3">
          <v-text-field
            @update:model-value="render"
            label="Height"
            type="number"
            v-model="selectedObject.data.height"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            @update:model-value="render"
            label="Width"
            type="number"
            v-model="selectedObject.data.width"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            @update:model-value="render"
            label="Shift Height"
            type="number"
            v-model="selectedObject.data.HSHIFT"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            @update:model-value="render"
            label="Shift Width"
            type="number"
            v-model="selectedObject.data.WSHIFT"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="selectedObject.data.location">
        <v-col cols="6">
          <v-text-field
            @update:model-value="render"
            label="X Offset"
            type="number"
            v-model="selectedObject.data.location.x"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            @update:model-value="render"
            label="Y Offset"
            type="number"
            v-model="selectedObject.data.location.y"
          ></v-text-field>
        </v-col>
      </v-row>

      <div>
        <code>
          {{ json }}
        </code>
      </div>
    </div>
  </v-container>
</template>

<style scoped></style>
