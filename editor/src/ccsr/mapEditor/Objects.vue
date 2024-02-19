<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../../store";
import { VDataTable } from "vuetify/labs/components";
import { base64toSrc } from "../helpers";
import { computed } from "vue";

type ReadonlyHeaders = VDataTable["headers"];

const headers: ReadonlyHeaders = [
  {
    title: "Image",
  },
  {
    title: "Member",
    value: "data.member",
  },
  {
    title: "Type",
    value: "data.data.item.type",
  },
  {
    title: "Action",
  },
];

const store = useStore();
const { gameMaps, gameObjects, selectedMap, imageFiles } = storeToRefs(store);

const mapObjects = computed(() =>
  gameObjects.value
    .filter((x) => x.mapName === selectedMap.value?.name)
    .sort((a, b) => b.id - a.id)
);

function getMemberImage(member?: string) {
  member = member?.toLowerCase();
  if (member?.includes("tile")) member = member.replace(".x", "");
  const image = imageFiles.value.find((x) => x.filename === member);
  if (!image) return undefined;
  const src = base64toSrc(image.data);
  console.log(src);
  return src;
}
</script>

<template>
  <v-container>
    <div v-if="!mapObjects.length">
      <p>No map selected!</p>
    </div>
    <div v-else>
      <v-list :items="mapObjects">
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
                variant="text"
                color="red"
                icon="mdi-close-circle-outline"
              />
            </div>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </v-container>
</template>

<style scoped></style>
