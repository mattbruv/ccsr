<script setup lang="ts">
import { ref } from "vue";
import { links } from "./nav";

import { useStore } from "./store";
import { EPISODE_DATA, loadEpisodeZipFile } from "./load";
import { computed } from "vue";
import WorldVue from "./World.vue";

const store = useStore();
// Load first episode for debugging
loadEpisodeZipFile(EPISODE_DATA[0].props.filename);

const title = computed(() => {
  const name = store.project.metadata.name;
  const app = "Map-O-Matic v2";
  return name ? app + " - " + name : app;
});

const showMapView = computed(() => store.UI.global.showMapViewer);
const mainPageColumns = computed(() => (showMapView.value ? 5 : 12));

const drawer = ref(true);
</script>

<template>
  <v-app>
    <v-layout class="full-height">
      <v-navigation-drawer v-model="drawer">
        <v-list density="default" nav>
          <div v-for="(link, i) in links">
            <v-list-item
              v-if="!link.subLinks"
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

      <v-app-bar density="compact">
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-app-bar-title>{{ title }}</v-app-bar-title>
      </v-app-bar>

      <v-main>
        <v-container fluid class="pa-0">
          <v-row no-gutters>
            <v-col :cols="mainPageColumns" class="main-panel">
              <!-- Main page content-->
              <router-view />
            </v-col>
            <v-col v-show="showMapView" cols="7" class="test full-height">
              <world-vue />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped>
.full-height {
  height: 100vh;
  max-height: 100vh;
}

.main-panel {
  overflow: auto;
}
</style>
