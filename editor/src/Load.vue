<script setup lang="ts">
//
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-card>
                    <div>Select me</div>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card style="padding: 1rem;">
                    <v-card-title>Load From Project File</v-card-title>
                    <v-card-subtitle>
                        Load a previously exported
                        Project File (.ccsr.zip)
                    </v-card-subtitle>
                    <v-file-input label="Select Project File" variant="underlined" :prepend-icon="'mdi-upload'"
                        accept=".ccsr.zip" append-inner-icon="mdi-folder-zip"></v-file-input>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped></style>