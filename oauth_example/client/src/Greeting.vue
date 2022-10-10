<template>
	<div class="greet">
		<h3 v-if="name">
			Welcome {{name}}
			<img
				:src="photo"
				:alt="photo"
				width="250"
				heigth="300"
			>
		</h3>
		<h3 v-else>You are not logged in</h3>
		<div>
			<u>authState:</u>
		</div>
		<div class="authStateBox">
			{{authState}}
		</div>
	</div>
  </template>
  <script>
  export default {
	name: 'GreetUser',
	// props: ["name"],
	props: {
		name: String,
		photo: String,
		authState: String,
	},
  };
</script>

<style > 
*{
	margin-top: 30px;
	text-align: center;
	font-size: 20px;
	font-family: 'Courier New', Courier, monospace;
}
.authStateBox {
	margin: 20px;
	background-color: lightcoral;
	border-radius: 25px;
}
</style>