<template lang="pug">
header
  nav
    ul
      li
        router-link(to="/") Knawat Shopping
      li
        button Cart
        p(v-if="$store.getters.cartCount") {{$store.getters.cartCount}}
        ul
          li(v-for="item in $store.getters.cartItems")
            p {{item.product.name.en}} : {{item.quantity}}
            button(@click="$store.commit('REMOVE_CART_ITEM', item.product.sku)") Remove
        router-link(to="/cart") View Cart
</template>

<script>
export default {
  name: "Navigation"
};
</script>
