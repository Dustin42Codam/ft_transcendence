<template>
  <div id="app">
    <header>
      <h1>42 API OAuth2 Example</h1>
    </header>
    <div id="container">
      <GreetUser v-bind:name="name" v-bind:photo="photo" :authState="authState" />
      <Login v-bind:name="name" :showSignout="showSignout" />
    </div>
  </div>
</template>

<script>
import GreetUser from "./Greeting";
import Login from "./Login";

export default {
  name: "app",
  components: {
    GreetUser,
    Login
  },
  data() {
    return {
      email: null,
      body: null,
      data: null,
      name: null,
      photo: null,
      authState: null,
      showSignout: false,
    };
  },
  mounted() {
    fetch(`http://localhost:9000/user`, {
      credentials: "include" // fetch won't send cookies unless you set credentials
    })
      .then(response => response.json())
      .then((data) => {
        if (data.authState == "Authorized") {
          this.name = data.name;
          this.photo = data.photo;
          this.showSignout = true;
        }
        else if (data.authState == "Not Authorized") {
          this.showSignout = true;
        }
        else if (data.authState == "Not Authenticated") {
          this.showSignout = false;
        }
        this.authState = data.authState;
      });
    }
};
</script>

<style>
h1 {
  text-align: center;
  font-size: 40px;
  font-family: Arial, Helvetica, sans-serif;
}
#container {
  box-sizing: border-box;
  border: 5px solid gray;
  border-radius: 15%;
  width: 400px;
  height: 400px;
  margin: auto;
}

</style>