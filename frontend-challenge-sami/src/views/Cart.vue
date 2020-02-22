<template lang="pug">
.container
  h1.page-title Cart
  section.cart
    ul
      li(v-if="$store.getters.isEmptyCart")
        p Your cart is empty.
        router-link.cart__cta.button(to="/") Shop now!

      cart-item(v-for="item in $store.getters.getCartItems" :key="item.product.sku" :item="item")
    
    .cart__summary.summary
      h2.summary__title Order Total
      ul.summary__details
        li.summary__item
          dt.summary__point Order Value
          dd.summary__value {{$store.getters.getCartPrice | formatCurrency}}
        li.summary__item
          dt.summary__point Weight
          dd.summary__value {{$store.getters.getCartWeight | formatWeight}}

      button.summary__btn.button(v-if="$store.getters.getCartItems[0]") Checkout Now
      router-link.summary__btn.button(v-else to="/") Continue Shopping

</template>

<script>
import CartItem from "@/components/CartItem";

export default {
  name: "Cart",
  components: {
    CartItem
  }
};
</script>

<style lang="stylus" scoped>
.cart__cta
  display: inline-block
  margin-top: 1.2rem

.cart
  display: grid
  grid-template-columns: 2fr 1fr

  &__summary
    padding: 1rem
    border: 2px solid $silver
    align-self: start

  @media only screen and (max-width: 960px)
    grid-template-columns: 1fr

    &__summary
      grid-row: 1
      margin-bottom: 2rem
      position: sticky
      top: -0.6rem
      background: $page-bg

.summary
  &__title
    font-size: 1.2rem
    margin-bottom: 1rem

  &__btn
    margin-top: 2rem
    width: 100%

  &__details
    font-size: 0.8rem

  &__item
    display: flex
    justify-content: space-between

    &:not(last-child)
      margin-bottom: 0.2rem

  &__value
    font-weight: bold
</style>
