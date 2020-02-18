<template lang="pug">
div
  h1 Explore our products list
  products-list(v-if="$store.getters.isAuthorized")
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
