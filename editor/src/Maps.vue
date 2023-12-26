<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";
import { ref } from "vue";
import { lingoValueToString } from "./ccsr/parser/parser";
import { LingoType, LingoArray } from "./ccsr/parser/types";
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

const json = computed(() => {
  if (selectedMap.value) {
    const map = store.project.maps.find(
      (x) => x.filename === selectedMap.value
    );

    if (map) {
      if (map.objectTree.type === LingoType.Array) {
        const names = map.objectTree.children.filter((x) => {
          return (
            x.type === LingoType.Object &&
            x.properties.some(
              (p) =>
                p.value.type === LingoType.Array &&
                p.key.value === "#message" &&
                p.value.children.length > 0
            )
          );
        });

        const array: LingoArray = {
          type: LingoType.Array,
          children: names,
        };

        console.log(array.children);

        const json = JSON.stringify(
          JSON.parse(lingoValueToString(map.objectTree)),
          null,
          2
        );
        return json;
      }
    }
  }
  return null;
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
            <v-textarea v-model="json" readonly></v-textarea>
          </div>
        </v-window-item>
        <v-window-item :value="Tabs.Collision"> Collision </v-window-item>
        <v-window-item :value="Tabs.Foo"> Foo </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
