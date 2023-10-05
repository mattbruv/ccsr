<script setup lang="ts">
import { ref } from "vue";
import { links } from "./nav"

const drawer = ref(false);

</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer">
        <v-list density="default" nav>
          <div v-for="(link, i) in links">
            <v-list-item v-if="!link.subLinks" :key="i" :to="link.to" avatar :prepend-icon="link.icon" :title="link.text">
            </v-list-item>
            <v-list-group v-else>
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" :prepend-icon="link.icon" :title="link.text"></v-list-item>
              </template>
              <v-list-item v-for="(subLink, j) in link.subLinks" :key="j" :title="subLink.text" :to="subLink.to"
                :prepend-icon="subLink.icon" :value="subLink.text"></v-list-item>
            </v-list-group>
            <v-divider style="margin-bottom: 0.5rem; margin-top: 0.5rem;" v-if="link.divider"></v-divider>
          </div>
        </v-list>
      </v-navigation-drawer>

      <v-main style="margin: 1rem">
        <router-view />
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped></style>
