<template lang="pug">
div
  h1 Cart
  section
    ul
      li(v-for="n in 4") {{'cart item ' + n}}
</template>

<script>
export default {
  name: "Cart"
};
</script>
