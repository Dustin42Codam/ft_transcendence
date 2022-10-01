<script setup lang="ts">
import { ref } from "vue";

interface Props {
  msg: string,
  date: string,
  username: string
}

const props = withDefaults(defineProps<Props>(), {
  msg: "default message",
  date: "01.01.1970 00:00",
  username: "default"
})

</script>

<template>
<!--change to make it blue list-group-item list-group-item-action active py-3 lh-sm-->
  <div class="d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
    <div class="list-group list-group-flush border-bottom scrollarea">
        <div class="d-flex w-100 align-items-center justify-content-between">
          <strong class="mb-1"> {{ username }} </strong>
          <small> {{ date }}</small>
        </div>
      <div class="col-10 mb-1 small"> {{ msg }} </div>
    </div>
  </div>
</template>

<style scoped>

</style>
