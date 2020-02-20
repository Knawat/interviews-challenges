<template lang="pug">
div#app
  navigation
  main.main
    router-view
</template>

<script>
import Navigation from "@/components/Navigation";

export default {
  name: "App",
  components: {
    Navigation
  },
  mounted() {
    if (!localStorage.getItem("token")) this.authorize();
  },
  methods: {
    async authorize() {
      const response = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          consumerKey: process.env.VUE_APP_CONSUMER_KEY,
          consumerSecret: process.env.VUE_APP_CONSUMER_SECRET
        })
      });
      const data = await response.json();

      const {
        channel: { token }
      } = data || { channel: { token: null } };

      localStorage.setItem("token", token);
      this.$store.commit("SET_AUTHORIZED", token);
    }
  }
};
</script>

<style lang="stylus">
#app
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  background-color $grey
  height 100%

.main
  padding-top 2rem
</style>
