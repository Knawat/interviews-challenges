<template lang="pug">
div#app
  .auth-loader(v-if="authorizing")
    spinner
    span.auth-loader__text Authenticating
  
  navigation
  main.main
    router-view
</template>

<script>
import { GENERATE_TOKEN } from "@/api/endpoints";
import Navigation from "@/components/Navigation";
import Spinner from "@/components/Spinner";

export default {
  name: "App",
  components: {
    Navigation,
    Spinner
  },
  data: () => ({
    authorizing: false
  }),
  mounted() {
    if (!this.$store.getters.isAuthorized) {
      this.authorize();
    }
  },
  methods: {
    async authorize() {
      try {
        this.authorizing = true;
        const {
          channel: { token }
        } = await this.$api(GENERATE_TOKEN, {
          consumerKey: process.env.VUE_APP_CONSUMER_KEY,
          consumerSecret: process.env.VUE_APP_CONSUMER_SECRET
        });
        this.$store.commit("SET_TOKEN", token);
      } catch (err) {
        console.log(err);
      } finally {
        this.authorizing = false;
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

.auth-loader
  position absolute
  left 50%
  top: 2rem
  transform translateX(-50%)
  display inline-flex
  align-items center
  color $dark-green
  font-size 0.8rem
  text-transform uppercase
  &__text
    margin-left 8px
    @media only screen and (max-width: 960px)
      display none
      margin-left none
</style>
