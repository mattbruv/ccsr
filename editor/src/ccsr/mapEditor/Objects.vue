<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../../store";
import { base64toSrc } from "../helpers";
import { computed } from "vue";
import { GameObject } from "../renderer/types";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const { gameMaps, gameObjects, selectedMap, imageFiles } = storeToRefs(store);

const mapObjects = computed(() =>
  gameObjects.value
    .filter((x) => x.mapName === selectedMap.value?.name)
    .sort((a, b) => b.id - a.id)
);

function editObject(obj: GameObject) {
  store.selectedObjectId = obj.id;
  router.push("object");
}

function deleteObject(obj: GameObject) {
  console.log(obj.id);
  gameObjects.value = gameObjects.value.filter((x) => x.id !== obj.id);
  store.render();
}

function givesItem(obj: GameObject): boolean {
  return (
    obj.data.data?.item?.COND?.some((x) => x?.giveObj !== undefined) ?? false
  );
}

function givesAct(obj: GameObject): boolean {
  return (
    obj.data.data?.item?.COND?.some((x) => x?.giveAct !== undefined) ?? false
  );
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
          v-for="mapObject in mapObjects"
          :key="mapObject.id"
          :title="mapObject.data.member"
          :border="true"
          color="primary"
          variant="plain"
        >
          <template v-slot:prepend>
            <div class="ma-3">
              <img
                :src="getMemberImage(mapObject.data.member?.toLowerCase())"
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
                @click="editObject(mapObject)"
              />
              <v-btn
                title="Delete Object"
                @click="deleteObject(mapObject)"
                color="red"
                variant="text"
                icon="mdi-close-circle-outline"
              />
            </div>
          </template>
          <div>
            <v-icon
              class="mr-2"
              v-if="mapObject.data.data?.message?.length"
              icon="mdi-message"
              title="Has Messages"
              size="x-small"
            />
            <v-icon
              class="mr-2"
              v-if="givesItem(mapObject)"
              icon="mdi-gift"
              color="cyan"
              title="Gives Items"
              size="x-small"
            />
            <v-icon
              class="mr-2"
              v-if="givesAct(mapObject)"
              icon="mdi-movie-open"
              title="Gives Acts"
              color="green"
              size="x-small"
            />
          </div>
        </v-list-item>
      </v-list>
    </div>
  </v-container>
</template>

<style scoped></style>
