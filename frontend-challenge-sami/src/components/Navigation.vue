<template lang="pug">
header
  nav
    ul
      li
        router-link(to="/") Knawat Shopping
      li
        button Cart
        ul
          li(v-for="item in this.$store.getters.cartItems") {{item.product.name.en}} : {{item.quantity}}
</template>

<script>
export default {
  name: "Navigation"
};
</script>
