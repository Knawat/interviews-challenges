<template>
  <v-row>
    <v-col v-if="$accessor.cart.cartItems && $accessor.cart.cartItems.length > 0">
      <v-sheet
        min-height="70vh"
        rounded="lg"
      >
        <Cartlist />
      </v-sheet>
    </v-col>
    <v-col v-else>
      <v-card min-width="250" align="center">
        Your Cart is Empty
        {{ returnHome() }}
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang='ts'>
import Vue from 'vue'
import Cartlist from '~/components/Cartlist.vue'

export default Vue.extend({
  name: 'Checkout',
  components: { Cartlist },
  methods: {
    returnHome (): void {
      this.$router.push('/')
    }
  }
})
</script>

<style scoped>

</style>
