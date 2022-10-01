<script setup lang="ts">
import MessageCard from "../components/MessageCard.vue";
import ChatInput from "../components/ChatInput.vue";
import { reactive } from "vue";

interface Person {
  name: string;
  age: number;
}

const arr2: Person[] = [
  { name: 'Alice', age: 27 },
  { name: 'Bob', age: 28 },
];

arr2.push({ name: 'Carl', age: 30});


interface Message {
  content: string;
  date: string;
  username: string;
}

const arr3: Message[] = [
  { content: "Hi how are you BACKEND?", date: "01.10.2022 21:14", username: "alkrusts" },
  { content: "For the chat we need these type of tables", date: "01.10.2022 21:14", username: "alkrusts" },
  { content: "id: number, name: string, visibility: (option publick, private, protected), admins: string[usernames], connected_users: string[usernames], password: salted_hash, muted_users: string[username], banned_users: string[username]", date: "1.10.2022 21:16", username: "alkrusts" }
];

/*
arr3.push({content: "Hi how are You?", date: "30.09.2022 23:14", username: "Alex"});
arr3.push({content: "Hi I am good have you aten bannanes?", date: "30.09.2022 23:14", username: "Jusha"});
arr3.push({content: "Yes! Bannanas are amziaing", date: "30.09.2022 23:14", username: "Alex"});
arr3.push({content: "I like to talk!", date: "30.09.2022 23:15", username: "Jusha"});
arr3.push({content: "I am sober for a long time now.", date: "30.09.2022 23:15", username: "Jusha"});
*/

</script>

<template>
  <div class="container">
    <div class="row">
      <MessageCard v-for="(item, index) in arr3" :msg="item.content" :date="item.date" :username="item.username" :index="index"></MessageCard>
      <ChatInput></ChatInput>
    </div>
  </div>
</template>

<style scoped>

</style>
