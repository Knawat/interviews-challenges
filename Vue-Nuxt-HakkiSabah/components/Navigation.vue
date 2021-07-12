<template>
  <div>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon to="/">
        Home
      </v-btn>

      <v-spacer />
      <Iconcart v-if="$route.path !== '/checkout'" />
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Categories
          </v-list-item-title>
          <v-list-item-subtitle>
            product qty per category
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item v-for="category in categories" :key="category.categoryName">
            <v-list-item-title>{{ category.categoryName }} ({{ category.products.length }})</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import Iconcart from '~/components/Iconcart.vue'
import { Cat, GET_CAT } from '~/store/models/category'

export default Vue.extend({
  name: 'Navigation',
  components: {
    Iconcart
  },
  data () {
    return {
      drawer: false,
      group: null,
      categories: [] as GET_CAT | Cat[]
    }
  },
  watch: {
    group (): void {
      this.drawer = false
    }
  },

  mounted (): void {
    this.categories = this.$accessor.categories
  }
})
</script>

<style scoped>

</style>
