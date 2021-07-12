<template>
  <div class="text-center">
    <v-menu
      open-on-hover
      :close-on-content-click="false"
      top
      offset-y
    >
      <template #activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            color="green"
            :content="$accessor.cart.cartItems && $accessor.cart.cartItems.length > 0 ? $accessor.cart.cartItems.length : '0'"
            bordered
            bottom
            offset-x="10"
            offset-y="10"
          >
            <v-icon>mdi-cart</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <LazyCart />
    </v-menu>
  </div>
</template>
<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'Iconcart',
  data: () => ({
    isHover: false
  })
})
</script>
