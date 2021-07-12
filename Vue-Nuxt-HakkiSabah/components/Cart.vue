<template>
  <v-card
    max-width="475"
    class="mx-auto"
  >
    <v-toolbar
      color="teal"
      dark
    >
      <v-toolbar-title>Cart</v-toolbar-title>
    </v-toolbar>
    <Cartlist v-if="isCartFilled.cartItems && isCartFilled.cartItems.length > 0" />
    <v-col v-else>
      <v-card min-width="250" align="center">
        Your Cart is Empty
      </v-card>
    </v-col>
  </v-card>
</template>
<script lang='ts'>
import Vue from 'vue'
import Cartlist from '~/components/Cartlist.vue'

export default Vue.extend({
  name: 'Cart',
  components: { Cartlist },
  computed: {
    isCartFilled () {
      return this.$accessor.cart
    }
  }

})
</script>

<style scoped>

</style>
