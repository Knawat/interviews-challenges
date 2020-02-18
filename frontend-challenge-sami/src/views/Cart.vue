<template lang="pug">
div
  h1 Cart
  section
    p(v-if="$store.getters.cartCount") {{$store.getters.cartCount}}
    ul
      li(v-for="item in $store.getters.cartItems")
        p {{item.product.name.en}} : {{item.quantity}}
        button(@click="$store.commit('REMOVE_CART_ITEM', item.product.sku)") Remove
</template>

<script>
export default {
  name: "Cart"
};
</script>
