<script setup lang="ts">
import { ref } from "vue";
import { links } from "./nav";

import { useStore } from "./store";
import { EPISODE_DATA, loadEpisodeZipFile } from "./load";
import { computed } from "vue";
import WorldVue from "./World.vue";
import Renderer from "./ccsr/renderer/renderer";

const store = useStore();
// Load first episode for debugging
loadEpisodeZipFile(EPISODE_DATA[0].props.filename);

const title = computed(() => {
  const name = store.metadata.name;
  const app = "Map-O-Matic v2";
  return name ? app + " - " + name : app;
});

const showMapView = computed(() => store.UI.global.showMapViewer);
const mainPageColumns = computed(() => (showMapView.value ? 5 : 12));

const drawer = ref(true);

const fullScreen = ref(false);

function toggleFullscreen() {
  fullScreen.value = !fullScreen.value;
  store.UI.global.showMapViewer = true;
  store.UI.global.showRouterView = fullScreen.value === false;
}

function resetView() {
  Renderer.resetView();
}
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon @click="resetView">
            <v-icon icon="mdi-camera-flip-outline"></v-icon>
          </v-btn>
        </template>
        <span>Reset Camera</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon @click="toggleFullscreen">
            <v-icon>{{
              fullScreen
                ? "mdi-arrow-collapse-horizontal"
                : "mdi-arrow-expand-horizontal"
            }}</v-icon>
          </v-btn>
        </template>
        <span>{{ fullScreen ? "Normal Map View" : "Full Map View" }}</span>
      </v-tooltip>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list density="default" nav>
        <div v-for="(link, i) in links">
          <v-list-item
            v-if="true"
            :key="i"
            :to="link.to"
            avatar
            :prepend-icon="link.icon"
            :title="link.text"
          >
          </v-list-item>
          <v-list-group v-else>
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="link.icon"
                :title="link.text"
              ></v-list-item>
            </template>
            <v-list-item
              v-for="(subLink, j) in link.subLinks"
              :key="j"
              :title="subLink.text"
              :to="subLink.to"
              :prepend-icon="subLink.icon"
              :value="subLink.text"
            ></v-list-item>
          </v-list-group>
          <v-divider
            style="margin-bottom: 0.5rem; margin-top: 0.5rem"
            v-if="link.divider"
          ></v-divider>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div class="container">
        <div v-show="store.UI.global.showRouterView" class="router-view">
          <router-view />
        </div>
        <div
          v-show="store.UI.global.showMapViewer"
          :class="{ fullWidth: fullScreen, 'map-view': !fullScreen }"
        >
          <world-vue />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  height: 90vh;
  overflow: hidden;
}
.router-view {
  overflow-y: auto;
  width: 40%;
}
.fullWidth {
  width: 100%;
}
.map-view {
  overflow-y: hidden;
  width: 60%;
}
</style>
