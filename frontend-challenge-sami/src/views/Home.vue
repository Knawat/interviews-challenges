<template lang="pug">
.container
  h1.page-title Explore our products list
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
