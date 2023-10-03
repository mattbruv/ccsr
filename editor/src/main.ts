import { createApp } from "vue";
import App from "./App.vue";
import { aliases, mdi } from "vuetify/iconsets/mdi";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";

const routes: any[] = [
  //{ path: "/food-log", component: FoodLog },
  //{ path: "/weight-log", component: WeightLog },
  //{ path: "/budget", component: Budget },
];

const router = createRouter({
  history: createWebHistory("ccsr/editor/"),
  routes,
});

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
  theme: {
    defaultTheme: "dark",
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(vuetify);
app.use(router);
app.use(pinia);

app.mount("#app");
