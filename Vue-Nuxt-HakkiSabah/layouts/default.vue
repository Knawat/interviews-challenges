<template>
  <v-app id="inspire">
    <Navigation />
    <v-main class="grey lighten-2">
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang='ts'>
import Vue from 'vue'
import Navigation from '~/components/Navigation.vue'

export default Vue.extend({
  components: {
    Navigation
  }
  // asyncData(ctx: Context): Promise<object | void> | object | void {
  //
  // }
})
</script>
