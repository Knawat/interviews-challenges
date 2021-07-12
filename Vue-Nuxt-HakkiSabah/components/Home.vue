<template>
  <v-row>
    <template v-for="category in isCatFilled">
      <v-col
        :key="category.categoryName"
        class="mt-2"
        cols="12"
      >
        <v-chip
          class="ma-2"
          color="teal"
          text-color="black"
        >
          <v-avatar left>
            <v-icon large>
              mdi-shape
            </v-icon>
          </v-avatar>
          {{ category.categoryName }}
        </v-chip>
      </v-col>
      <v-col
        v-for="product in category.products"
        :key="product.name"
        cols="6"
      >
        <v-card>
          <div @click="showProduct(product)">
            <v-responsive>
              <v-img
                :src="product.imageURL"
                class="img-cursor white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-card-title v-text="product.name" />
              </v-img>
            </v-responsive>
          </div>
          <v-card-actions>
            <v-btn
              block
              color="rgba(0,0,0,.3), rgba(0,0,0,.5)"
              @click="addCart(product)"
            >
              Add to cart
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </template>
    <Modal v-if="dialog" :modal-product="modalProduct" :dialog="dialog" @dialog="dialog = $event" />
  </v-row>
</template>

<script lang='ts'>
import Vue from 'vue'
import Modal from '~/components/Modal.vue'
import { ADD_CART, product, UPDATE_CART } from '~/store/models/cart'

export default Vue.extend({
  name: 'Home',
  components: { Modal },
  data () {
    return {
      dialog: false,
      modalProduct: {}
    }
  },
  computed: {
    isCatFilled () {
      return this.$accessor.categories
    }
  },
  methods: {
    showProduct (product: product): void {
      this.modalProduct = product
      this.dialog = true
    },
    async addCart (product: ADD_CART): Promise<void> {
      // if same product in the cart, that mean we update quantity while addCart uses
      const isInCart = this.$accessor.cart.cartItems.filter(item => product.id === item.product.id)
      if (isInCart.length < 1) {
        await this.$accessor.addItem({
          id: this.$accessor.lastCartId,
          productId: product.id,
          quantity: 1
        })
      } else {
        const updateItem: UPDATE_CART = {
          id: isInCart[0].id,
          productId: isInCart[0].product.id,
          quantity: +isInCart[0].quantity + 1
        }
        await this.$accessor.updateItem(updateItem)
      }
    }
  }
})
</script>

<style scoped>
.img-cursor {
  cursor: pointer;
}
</style>
