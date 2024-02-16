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
  gameObjects.value.filter((x) => x.mapName === selectedMap.value?.name)
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
    <v-virtual-scroll :height="700" :items="mapObjects">
      <template v-slot:default="{ item }">
        <v-list-item
          :key="item.id"
          :title="item.data.member"
          :subtitle="item.mapName"
        >
          <template v-slot:prepend>
            <img :src="getMemberImage(item.data.member?.toLowerCase())" />
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-container>
</template>

<style scoped></style>
