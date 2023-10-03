<script setup lang="ts">
import { ref } from "vue";

const drawer = ref(false);

const links = [
  {
    to: "/health",
    text: "Health",
    icon: "mdi-heart",
    subLinks: [
      {
        to: "/food-log",
        text: "Food Log",
        icon: "mdi-food",
      },
      {
        to: "/weight-log",
        text: "Weight Log",
        icon: "mdi-scale-bathroom",
      },
    ],
  },
  {
    to: "/wealth",
    text: "Finances",
    icon: "mdi-currency-usd",
    subLinks: [
      {
        to: "/budget",
        text: "Budget",
        icon: "mdi-chart-pie",
      },
    ],
  },
];
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar>
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer">
        <v-list density="compact" nav>
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
