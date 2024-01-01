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
  const name = store.metadata.name;
  const app = "Map-O-Matic v2";
  return name ? app + " - " + name : app;
});

const showMapView = computed(() => store.UI.global.showMapViewer);
const mainPageColumns = computed(() => (showMapView.value ? 5 : 12));

const drawer = ref(true);
</script>

<template>
  <v-app>
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

    <div class="app-content">
      <v-app-bar>
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-app-bar-title>{{ title }}</v-app-bar-title>
      </v-app-bar>

      <v-main>
        <v-container fluid class="pa-0 fill-height">
          <v-row no-gutters class="fill-height" style="max-height: 100%">
            <v-col
              :cols="mainPageColumns"
              class="pa-2"
              style="background-color: blue; height: 100%; max-height: 100%"
            >
              <!-- Main page content-->
              <router-view />
            </v-col>

            <!-- This is dumb as fuck, but setting it to 100% makes
              the resize observer go fucking crazy and the column's height expands vertically forever
            -->
            <v-col v-show="showMapView" cols="7" style="max-height: 99%">
              <world-vue />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<style scoped>
html {
  overflow-y: auto;
}

.app-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: red;
}
</style>
