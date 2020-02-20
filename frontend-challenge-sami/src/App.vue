<template lang="pug">
div#app
  navigation
  main.main
    router-view
</template>

<script>
import { getToken } from "@/services/token";
import Navigation from "@/components/Navigation";

export default {
  name: "App",
  components: {
    Navigation
  },
  mounted() {
    if (!this.$store.getters.isAuthorized) {
      this.authorize();
    }
  },
  methods: {
    async authorize() {
      try {
        const token = await getToken();
        this.$store.commit("SET_TOKEN", token);
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang="stylus">
#app
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  display flex
  flex-direction column
  height 100%

.main
  padding-top 2rem
  background-color $grey
  flex 1
</style>
