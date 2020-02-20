<template lang="pug">
section
  ul.products-list
    template(v-if="fetching")
      li(v-for="n in 6" :key="n")
        content-loader(:height="400")
        content-loader(:height="40")
    
    template(v-else)
      li(v-for="product in products" :key="product.sku")
        Product(:product="product")
  
  pagination(
    v-if="products.length"
    :currentPage="currentPage"
    :total="total"
    :paginating="fetching"
    @next="getNextPage"
    @prev="getPreviousPage"
    )
</template>

<script>
import { ContentLoader } from "vue-content-loader";
import { LIST_PRODUCTS } from "@/api/endpoints";

import Pagination from "@/components/Pagination";
import Product from "@/components/Product";

export default {
  name: "ProductsList",
  components: {
    Pagination,
    Product,
    ContentLoader
  },
  data() {
    return {
      products: [],
      total: 0,
      currentPage: this.$route.query.page || 1,
      fetching: true
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const { products, total } = await this.$api(LIST_PRODUCTS, {
          page: this.$route.query.page || this.currentPage
        });

        this.products = products;
        this.total = total;
      } catch (err) {
        this.products = [];
        this.total = 0;
        console.log(err);
      } finally {
        this.fetching = false;
      }
    },
    getNextPage() {
      this.currentPage++;
      this.refetch();
    },
    getPreviousPage() {
      this.currentPage--;
      this.refetch();
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    refetch() {
      this.fetching = true;
      this.$router.push(`?page=${this.currentPage}`);
      this.fetchProducts();
      this.scrollToTop();
    }
  },
  watch: {
    $route(to) {
      if (!to.query.page) {
        this.currentPage = 1;
        this.refetch();
      }
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
