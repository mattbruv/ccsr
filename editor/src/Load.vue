<script setup lang="ts">
import { ref } from "vue";
import { loadEpisodeZipFile } from "./load";
import { watch } from "vue";
import { useStore } from "./store";
import { computed } from "vue";

const episodeData = [
  {
    title: "Episode 1: Pool Problems",
    props: { filename: "1.ccsr.zip" },
  },
  {
    title: "Episode 2: Tennis Menace",
    props: { filename: "2.ccsr.zip" },
  },
  {
    title: "Episode 3: Vivian vs. the Volcano",
    props: { filename: "3.ccsr.zip" },
  },
  {
    title: "Episode 4: Disco Dilema",
    props: { filename: "4.ccsr.zip" },
  },
  {
    title: "Scooby Doo and the Hollywood Horror: Part 1",
    props: { filename: "scooby-1.ccsr.zip" },
  },
  {
    title: "Scooby Doo and the Hollywood Horror: Part 2",
    props: { filename: "scooby-2.ccsr.zip" },
  },
];

const loading = ref(false);
const store = useStore();
const percentLoaded = computed(() => store.data.loadPercent);
const episodes = episodeData.map((x) => x.title);

const selectedEpisode = ref<string>();

watch(selectedEpisode, async () => {
  const zipFile = episodeData.find((x) => x.title === selectedEpisode.value)
    ?.props.filename;

  if (zipFile) {
    loading.value = true;
    await loadEpisodeZipFile(zipFile);
    loading.value = false;
  }
});
</script>

<template>
  <v-container v-if="loading">
    <v-progress-linear v-model="percentLoaded"></v-progress-linear>
  </v-container>
  <v-container v-else>
    {{ store.data.maps.map((x) => x.filename) }}
    <v-row>
      <v-col cols="12" md="6">
        <v-card style="padding: 1rem">
          <v-card-title>Load From Episode</v-card-title>
          <v-card-subtitle>
            Load data from existing an existing episode.
          </v-card-subtitle>
          <div style="padding-top: 1rem">
            <v-select
              label="Select Episode"
              v-model="selectedEpisode"
              :items="episodes"
            ></v-select>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card style="padding: 1rem" variant="tonal">
          <v-card-title>Load From Project File</v-card-title>
          <v-card-subtitle>
            Load a previously exported Project File (.ccsr.zip)
          </v-card-subtitle>
          <v-file-input
            label="Select Project File"
            variant="underlined"
            :prepend-icon="'mdi-upload'"
            accept=".ccsr.zip"
            append-inner-icon="mdi-folder-zip"
          ></v-file-input>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
