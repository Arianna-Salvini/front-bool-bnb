<script>
import axios from 'axios';
import AppHeader from './components/appHeader.vue';
import AppFooter from './components/appFooter.vue';

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  name: 'App',
  data() {
    return {

    }
  },
  methods: {
  },

}
</script>

<template>

  <appHeader />

  <router-view></router-view>

  <appFooter />

</template>

<style></style>
