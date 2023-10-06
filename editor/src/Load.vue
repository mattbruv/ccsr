<script setup lang="ts">
import { dataStore } from "./data";
const episodeSelections = [
  "Episode 1: Pool Problems",
  "Episode 2: Tennis Menace",
  "Episode 3: Vivian vs. the Volcano",
  "Episode 4: Disco Dilema",
  "Scooby Doo and the Hollywood Horror: Part 1",
  "Scooby Doo and the Hollywood Horror: Part 2",
];
</script>

<template>
  <v-container>
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
              :items="episodeSelections"
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
