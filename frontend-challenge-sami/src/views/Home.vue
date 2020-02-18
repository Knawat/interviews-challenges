<template lang="pug">
div
  h1 Explore our products list
  products-list
</template>

<script>
import ProductsList from "@/components/ProductsList";

export default {
  name: "Home",
  components: {
    ProductsList
  }
};
</script>
