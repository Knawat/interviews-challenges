<template>
  <div class="columns is-centered is-multiline" style="margin:10px">
    <template v-if="products">
      <div class="card column is-one-quarter" v-for="product in productsList" :key="product.sku">
        <VmProducts :product="product"></VmProducts>
      </div>
    </template>
    <div class="section" v-if="!products || products.length === 0">
      <p>{{ noProductLabel }}</p>
    </div>
  </div>
</template>

<script>
import VmProducts from "../Products";

export default {
  name: "productsList",
  props: {
    productsList: { type: Array }
  },
  components: { VmProducts },
  data() {
    return {
      noProductLabel: "No product found",
      products: []
    };
  },
  computed: {
    allProducts() {
      return this.products;
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  margin: 10px;
}
</style>
