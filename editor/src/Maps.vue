<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";
import { ref } from "vue";
// import { lingoValueToString } from "./ccsr/parser/parser";
import { LingoType } from "./ccsr/parser/types";
import { lingoArrayToMapData } from "./ccsr/game/fromLingo";
import { MapDataType, MapObjectData } from "./ccsr/game/types";
import { watch } from "vue";
const store = useStore();

enum Tabs {
  Maps,
  Collision,
  Foo,
}

const mapNames = computed(() => {
  return store.project.maps
    .map((x) => x.filename)
    .sort((a, b) => a.localeCompare(b));
});

const tab = ref(Tabs.Maps);
const selectedMap = ref<string | null>(null);

const map = computed(() =>
  store.project.maps.find((x) => x.filename === selectedMap.value)
);

const mapObject = computed(() => {
  if (map.value && map.value.parseResult.value.type === LingoType.Array) {
    const array = lingoArrayToMapData(map.value.parseResult.value);
    return array;
  }
});

const messages = computed(() => {
  return mapObject.value?.objects
    .filter((x) => x.data?.message && x.data.message.length > 0)
    .flatMap((x) => x.data?.message?.flatMap((y) => y?.text));
});

const errors = computed(() => {
  return store.project.maps.filter((x) => x.parseResult.parseError);
});
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
        <v-window-item :value="Tabs.Maps">
          <div>
            <v-select
              v-model="selectedMap"
              label="Foo"
              :items="mapNames"
            ></v-select>
            <p>Selected map: {{ selectedMap }}</p>
            <div v-for="error in errors">
              {{ error.filename }}
              {{ error.parseResult.lexError }}
              {{ error.parseResult.parseError }}
            </div>

            <div v-for="message in messages">
              {{ message }}
            </div>
          </div>
        </v-window-item>
        <v-window-item :value="Tabs.Collision"> Collision </v-window-item>
        <v-window-item :value="Tabs.Foo"> Foo </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
