<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";
import { ref } from "vue";
// import { lingoValueToString } from "./ccsr/parser/parser";
import { LingoType } from "./ccsr/parser/types";
import { lingoArrayToMapData } from "./ccsr/game/fromLingo";
import { mapObjectToLingo } from "./ccsr/game/toLingo";
import { lingoValueToString } from "./ccsr/parser/print";
import { MapDataType, MapObjectData, MapObjectType } from "./ccsr/game/types";
import { watch } from "vue";
import { compileToFunction } from "vue";
import { Follow } from "pixi-viewport";
const store = useStore();
</script>

<template>
  <div>hi</div>
</template>

<style scoped></style>
