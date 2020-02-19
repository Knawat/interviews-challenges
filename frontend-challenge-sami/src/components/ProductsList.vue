<template lang="pug">
section
  ul.products-list
    li(v-for="product in products" :key="product.sku"): Product(:product="product")
  pagination(v-if="products.length" :total="total" @next="getNextPage" @prev="getPreviousPage")
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
    currentPage: 1
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
    },
    getNextPage() {
      this.currentPage++;
      this.getProducts();
    },
    getPreviousPage() {
      this.currentPage--;
      this.getProducts();
    }
  }
};
</script>

<style lang="stylus" scoped>
$card-width=300px
$column-gap=20px
$grid-max-width=($card-width * 2) + $column-gap
$row-gap=2 * $column-gap

.products-list
  display grid
  grid-template-columns repeat(auto-fit, minmax($card-width, 1fr))
  max-width $grid-max-width
  margin 0 auto
  grid-column-gap $column-gap
  grid-row-gap $row-gap
  grid-auto-rows 1fr
</style>
