<template lang="pug">
section.products-list
  article.products-list__product(v-for="product in products" :key="product.sku")
    h2 {{'product ' + product.sku}}

  pagination(:total="this.total" @next="getNextPage" @prev="getPreviousPage")
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: "ProductsList",
  components: {
    Pagination
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
