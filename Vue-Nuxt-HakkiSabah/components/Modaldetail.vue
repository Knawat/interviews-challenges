<template>
  <div>
    <v-img
      :src="productDetail.imageURL"
      class="white--text align-end"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      :height="imgHeight"
    >
      <v-card-title v-text="productDetail.name" />
    </v-img>
    <v-card-text class="mt-3">
      <v-row>
        <v-card-title>{{ productDetail.name }}</v-card-title>
        <v-spacer />
        <v-card-title>Price {{ productDetail.price }}</v-card-title>
      </v-row>
      <v-card-subtitle>Description</v-card-subtitle>
      <v-card-text>{{ productDetail.description }}</v-card-text>
    </v-card-text>
  </div>
</template>

<script lang='ts'>
import Vue, { PropOptions } from 'vue'
import { product } from '~/store/models/cart'

export default Vue.extend({
  name: 'Modaldetail',
  data () {
    return {
      imgHeight: 0
    }
  },
  props: {
    productDetail: {
      type: Object,
      default: {} as product
    } as PropOptions<product>
  },
  mounted (): void {
    const self = this
    const imgAnim = setInterval(() => {
      if (self.imgHeight < 200) {
        self.imgHeight++
      } else {
        clearInterval(imgAnim)
      }
    }, 1)
  }
})
</script>

<style scoped>

</style>
