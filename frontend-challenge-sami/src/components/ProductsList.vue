<template lang="pug">
section
  ul.products-list
    li(v-for="product in products" :key="product.sku"): Product(:product="product")
  pagination(v-if="products.length" :currentPage="currentPage" :total="total" :paginating="fetching" @next="getNextPage" @prev="getPreviousPage")
</template>

<script>
import Pagination from "@/components/Pagination";
import Product from "@/components/Product";

export default {
  name: "ProductsList",
  components: {
    Pagination,
    Product
  },
  data: () => ({
    products: [],
    total: 0,
    currentPage: 1,
    fetching: true
  }),
  mounted() {
    this.getProducts();
  },
  methods: {
    async getProducts() {
      const response = await fetch(
        `/api/catalog/products?page=${this.currentPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await response.json();
      const { products, total } = data || { products: [], total: 0 };

      this.products = products;
      this.total = total;
      this.fetching = false;
    },
    getNextPage() {
      this.fetching = true;
      this.currentPage++;
      this.getProducts();
    },
    getPreviousPage() {
      this.fetching = true;
      this.currentPage--;
      this.getProducts();
    }
  }
};
</script>

<style lang="stylus" scoped>
$card-width=300px
$column-gap=50px
$grid-max-width=($card-width * 2) + $column-gap
$row-gap=1.5 * $column-gap

.products-list
  display grid
  grid-template-columns repeat(auto-fit, minmax($card-width, 1fr))
  max-width $grid-max-width
  margin 0 auto
  grid-column-gap $column-gap
  grid-row-gap $row-gap
  grid-auto-rows 1fr
</style>
