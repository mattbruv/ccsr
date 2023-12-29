<script setup lang="ts">
import { ref } from "vue";
import { EPISODE_DATA, loadEpisodeZipFile } from "./load";
import { watch } from "vue";
import { useStore } from "./store";

const loading = ref(false);
const store = useStore();
const episodes = EPISODE_DATA.map((x) => x.title);

const selectedEpisode = ref<string>();

watch(selectedEpisode, async () => {
  const zipFile = EPISODE_DATA.find((x) => x.title === selectedEpisode.value)
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
    <!--
    <v-progress-linear v-model="percentLoaded"></v-progress-linear>
    -->
  </v-container>
  <v-container v-else>
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
