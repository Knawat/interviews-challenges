<template lang="pug">
section.products-list
  article.products-list__product(v-for="n in 10")
    h2 {{'product ' + n}}
  pagination
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: "ProductsList",
  components: {
    Pagination
  }
};
</script>
