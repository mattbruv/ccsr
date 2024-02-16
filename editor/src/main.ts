import { createApp } from "vue";
import App from "./App.vue";
import { aliases, mdi } from "vuetify/iconsets/mdi";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import LoadVue from "./Load.vue";
import MapsVue from "./Maps.vue";
import MapEditorVue from "./ccsr/mapEditor/MapEditor.vue";
import ObjectsVue from "./ccsr/mapEditor/Objects.vue";
import ObjectEditorVue from "./ccsr/mapEditor/ObjectEditor.vue";

const routes: any[] = [
  { path: "/", component: MapsVue },
  { path: "/load", component: LoadVue },
  { path: "/map", component: MapEditorVue },
  { path: "/objects", component: ObjectsVue },
  { path: "/object", component: ObjectEditorVue },
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
