<template>
  <v-col>
    <v-subheader>Products</v-subheader>
    <v-card class="col-md-12 mb-3">
      <v-btn block @click="emptyCart()">
        Empty Cart
      </v-btn>
    </v-card>
    <v-card :max-height="$vuetify.breakpoint.height <= 568 ? 230 : 300" class="overflow-y-auto pt-2">
      <v-list-item v-for="(item, index) in isCartFilled.cartItems" :key="index">
        <v-card class="pl-3 pr-3 mb-2 col-md-12">
          <v-list-item-content outlined>
            <v-list-item-title class="mb-1">
              {{ item.product.name }}
            </v-list-item-title>
            <v-text-field
              :key="item.id"
              type="number"
              dense
              outlined
              solo
              prepend-inner-icon="mdi-minus-thick"
              append-icon="mdi-plus-thick"
              append-outer-icon="mdi-close-thick"
              label="Quantity"
              :value="item.quantity"
              @click:append-outer="deleteItem(item)"
              @click:prepend-inner="handleItemQuantity(item,'-')"
              @click:append="handleItemQuantity(item,'+')"
              @input="$event && +$event === 0 ? deleteItem(item) :enterQty($event,item)"
            />
            <v-btn v-if="qty && isAppendCurrentItem === item.id && qty > 0" @click="handleItemQuantity(item)">
              append quantity
            </v-btn>
            <v-list-item-content>
              <v-list-item-subtitle>
                Sub total for {{ item.product.name }} :
              </v-list-item-subtitle>
              <v-list-item-subtitle class="font-weight-bold">
                {{ item.quantity * item.product.price }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item-content>
        </v-card>
      </v-list-item>
    </v-card>
    <v-divider />
    <v-list-item-content>
      <v-col>
        Total : <strong> {{ isCartFilled.totalCost }} </strong>
      </v-col>
      <v-col align="end">
        <v-btn
          to="/checkout"
          class="ma-2"
          color="success"
        >
          Checkout
        </v-btn>
      </v-col>
    </v-list-item-content>
  </v-col>
</template>

<script lang='ts'>
import Vue from 'vue'
import { cartItems, UPDATE_CART } from '~/store/models/cart'

export default Vue.extend({
  name: 'Cartlist',
  data () {
    return {
      qty: 0,
      isAppendCurrentItem: null as unknown as number
    }
  },
  computed: {
    isCartFilled () {
      return this.$accessor.cart
    }
  },
  methods: {
    qtyCorrection (Qty:number) {
      const tmp = Qty
      const isCorrect = Qty
        .toString().split('').filter((char: any) => !isNaN(Number(char))).join('')
      return +tmp === +isCorrect
    },
    emptyCart (): void {
      this.$accessor.emptyCart()
    },
    enterQty (Qty: number, item: cartItems): void {
      // which item enter for qty
      this.isAppendCurrentItem = item.id
      this.qty = Qty
    },
    increaseOrDecrease (symbol: string, item: cartItems): number {
      return symbol === '+' ? +item.quantity + 1 : +item.quantity - 1
    },
    handleItemQuantity (item: cartItems, symbol?: string): void {
      const self = this
      const updateItem: UPDATE_CART = {
        id: item.id,
        productId: item.product.id,
        quantity: self.qty ? self.qty : self.increaseOrDecrease(symbol!, item)
      }
      // Every handling checking cart for per item quantity.
      if (updateItem.quantity > 0 && this.qtyCorrection(updateItem.quantity)) {
        this.$accessor.updateItem(updateItem)
      } else {
        this.deleteItem(item)
        if (this.isCartFilled.cartItems.length < 2) {
          this.$router.push('/')
        }
      }
      // Reset next manuel quantity
      this.qty = 0
    },
    deleteItem (item: cartItems): void {
      this.$accessor.deleteItem(item.id)
    }
  }
})
</script>

<style scoped>

</style>
