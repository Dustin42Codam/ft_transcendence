<script setup lang="ts">

var message: string = "";
const username: string = "DUDE";

interface Message {
  content: string;
  date: string;
  username: string;
}

function test(message: string) {
  let today = new Date();
  let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();;
  console.log("TEST: ", message, date, username);
}

</script>

<template>
  <form onsubmit="return false" v-on:submit="test(message)">
    <div class="mb-3">
      <input type="text" class="form-control" data-testid="input-field-test" id="input-field" v-model="message">
    </div>
  </form>
</template>

<style scoped>

</style>
