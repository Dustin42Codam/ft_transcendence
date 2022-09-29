<script setup lang="ts">

import axios from 'axios';
import { ref } from "vue";

const email: string = ref("");
const password: string = ref("");

function onSubmit() {
  console.log(email.value);
  console.log(password.value);
  axios({
    method: "post",
    url: "http://backend:3000/",
    data:{
      username: email.value,
      password: password.value
    }
  });
}

</script>

<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-1"
        label="Intra Email address:"
        label-for="input-1"
        description="We'll use 42.api for auth"
      >
        <b-form-input
          id="input-1"
          type="email"
          placeholder="Enter email"
          v-model="email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Intra Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          type="password"
          placeholder="Enter password"
          v-model="password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>
