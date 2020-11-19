<template>
  <v-row justify="center" align="center">
    <v-col v-for="product in products" :key="product.sku">
      <product
        :title="product.name.tr"
        :link="imageName(product.images[0], product.name.tr)"
        :price="product.variations.market_price"
        :sku="product.sku"
      />
    </v-col>
    <div class="text-center">
      <v-pagination v-model="page" :length="count / 10" :total-visible="9" />
    </div>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import product from '~/components/product.vue'

export default {
  components: {
    product
  },
  data () {
    return {
      page: 1
    }
  },
  created () {
    this.$store.dispatch('products/getAllProducts', this.page)
  },
  computed: {
    ...mapState({
      products: state => state.products.all,
      count: state => state.products.count
    })
  },
  watch: {
    page () {
      this.$store.dispatch('products/getAllProducts', this.page)
    }
  },
  methods: {
    ...mapActions('cart', ['addProductToCart']),
    imageName (link, name) {
      return `${link}/${name}/200`
    }
  }
}
</script>
