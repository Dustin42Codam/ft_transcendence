<script setup lang="ts">
import MessageCard from "../components/MessageCard.vue";
import { reactive } from "vue";

interface Person {
  name: string;
  age: number;
  [key: string]: any; // 👈️ index signature
}

const arr2: Person[] = [
  { name: 'Alice', age: 27 },
  { name: 'Bob', age: 28, country: 'Chile' },
];

arr2.push({ name: 'Carl', age: 30, country: 'Canada' });


interface Message {
  content: string;
  date: string;
  username: string;
}

const Messages: Message[] = [
  {"Hi how are You?", "30.09.2022 23:14", "Jusha"},
];

Messages.push({"Hi how are You?", "30.09.2022 23:14", "Jusha"});
Messages.push({"Not Bad. How are You?", "30.09.2022 23:14", "Alex"});
Messages.push({"Good. Can I ask You a qestion?", "30.09.2022 23:15", "Jusha"});
console.log(Messages);

interface Person {
  name: string;
  age: number;
  [key: string]: any; // 👈️ index signature
}

const arr2: Person[] = [
  { name: 'Alice', age: 27 },
  { name: 'Bob', age: 28, country: 'Chile' },
];

arr2.push({ name: 'Carl', age: 30, country: 'Canada' });

</script>

<template>
  <MessageCard msg="TEST" date="30.09.2022 23:14" username="Jusha"></MessageCard>
</template>

<style scoped>

</style>
