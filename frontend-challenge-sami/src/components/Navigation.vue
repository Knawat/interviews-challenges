<template lang="pug">
header
  nav
    ul
      li
        router-link(to="/") Knawat Shopping
      li
        button Cart
        ul
          li(v-for="item in this.$store.getters.cartItems")
            p {{item.product.name.en}} : {{item.quantity}}
            button(@click="$store.commit('REMOVE_CART_ITEM', item.product.sku)") Remove
</template>

<script>
export default {
  name: "Navigation"
};
</script>
