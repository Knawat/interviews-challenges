<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn :disabled="!productAmount" icon to="/cartPage">
        <v-badge
          v-if="productAmount"
          :content="productAmount"
          :value="productAmount"
          color="green"
          left
          bottom
          to="/cartPage"
        />
        <v-icon large>
          mdi-cart-outline
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer absolute app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      title: 'Knawat Demo Store'
    }
  },
  computed: {
    ...mapGetters({
      productAmount: 'cart/productAmount'
    })
  }
}
</script>
