<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../../store";
import { VDataTable } from "vuetify/labs/components";
import { base64toSrc } from "../helpers";
import { computed } from "vue";
import { GameObject } from "../renderer/types";

type ReadonlyHeaders = VDataTable["headers"];

const store = useStore();
const { gameMaps, gameObjects, selectedMap, imageFiles } = storeToRefs(store);

const mapObjects = computed(() =>
  gameObjects.value
    .filter((x) => x.mapName === selectedMap.value?.name)
    .sort((a, b) => b.id - a.id)
);

function deleteObject(obj: GameObject) {
  console.log(obj.id);
  gameObjects.value = gameObjects.value.filter((x) => x.id !== obj.id);
  store.render();
}

function getMemberImage(member?: string) {
  member = member?.toLowerCase();
  if (member?.includes("tile")) member = member.replace(".x", "");
  const image = imageFiles.value.find((x) => x.filename === member);
  if (!image) return undefined;
  const src = base64toSrc(image.data);
  return src;
}
</script>

<template>
  <v-container>
    <div v-if="!selectedMap">
      <p>No map selected!</p>
    </div>
    <div v-else>
      <div class="mb-2">
        <v-btn :prepend-icon="'mdi-plus'">Add Object</v-btn>
      </div>
      <v-list v-if="mapObjects.length" :items="mapObjects">
        <v-list-item
          v-for="item in mapObjects"
          :key="item.id"
          :title="item.data.member"
          :border="true"
          color="primary"
          variant="plain"
        >
          <template v-slot:prepend>
            <div class="ma-3">
              <img
                :src="getMemberImage(item.data.member?.toLowerCase())"
                style="max-width: 32px; max-height: 32px"
              />
            </div>
          </template>
          <template v-slot:append>
            <div class="ma-3">
              <v-btn
                title="Edit Object"
                variant="text"
                icon="mdi-file-edit-outline"
              />
              <v-btn
                title="Delete Object"
                @click="deleteObject(item)"
                color="red"
                variant="text"
                icon="mdi-close-circle-outline"
              />
            </div>
          </template>
          <div>
            <v-icon
              v-if="item.data.data?.message?.length"
              icon="mdi-message"
              size="x-small"
            />
          </div>
        </v-list-item>
      </v-list>
    </div>
  </v-container>
</template>

<style scoped></style>
