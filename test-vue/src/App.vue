<template>
  <div id="app">
    <AccountManager />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AccountManager from './components/AccountManager.vue';

export default defineComponent({
  name: 'App',
  components: {
    AccountManager,
  },
});
</script>