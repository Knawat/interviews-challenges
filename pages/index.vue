<template>
  <div>
    <VmHero></VmHero>
    <VmProductsList v-if="products.length > 0" :productsList="products"></VmProductsList>
    <div class="section" v-if="!isDataLoaded">
      <progress class="progress is-small is-primary" max="100">Loading product</progress>
    </div>
    <div class="section" v-else-if="isDataLoaded && products.length === 0">No Data Found!</div>
  </div>
</template>

<script>
import knawatAPI from "@/.vscode/packages/KnawatAPI.js";
import VmProductsList from "@/components/products_list/ProductsListContainer";
import VmHero from "@/components/hero/Hero";

export default {
  name: "index",
  components: {
    VmHero,
    VmProductsList
  },
  data() {
    return {
      products: [],
      isDataLoaded: false
    };
  },
  async created() {
    let knawatApi = new knawatAPI();
    var accessToken = await knawatApi.getAccessToken();
    if (accessToken) {
      // Get Products
      await knawatApi
        .getProductsfromAPI()
        .then(res => {
          this.products = res ? res.products : [];
          if (localStorage && localStorage["products"]) {
            var existingProducts = JSON.parse(localStorage["products"]);
            this.$store.commit("loadExistingProduct", existingProducts);
            // existingProducts.forEach(product => {});
          }
          this.isDataLoaded = true;
          if (!res) {
            // show message
          }
        })
        .catch(err => {
          // TODO: handle error globally
          this.isDataLoaded = true;
        });
    }
  },
  computed: {
    allProducts() {
      return this.products;
    }
  },
  methods: {}
};
</script>
