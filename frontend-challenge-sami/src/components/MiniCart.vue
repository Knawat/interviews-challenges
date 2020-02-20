<template lang="pug">
.cart
  ul.cart__items
    li(v-if="!$store.getters.cartItems[0]"): p Cart is empty
    
    li.cart__item(v-for="item in $store.getters.cartItems")
      .cart__item-thumb
        img.cart__item-image(:src="item.product.images[0] ? item.product.images[0] : null" :alt='item.product.name.en')
      .cart__item-details
        p.cart__item-title {{item.product.name.en}}
        p.cart__item-quantity Quantity: {{item.quantity}}
        button.cart__item-remove(@click="$store.commit('REMOVE_CART_ITEM', item.product.sku)") Remove
  
  .cart__actions(v-if="$store.getters.cartItems[0]")
    router-link.cart__link(to="#") Checkout
    router-link.cart__link(to="/cart") View Cart
</template>

<script>
export default {
  name: "MiniCart"
};
</script>

<style lang="stylus" scoped>
.cart
  position absolute
  right 8%
  top 55px
  background #fff
  width 280px
  padding 1rem
  transition all ease-out 100ms
  transform-origin top
  border-radius 0.2rem
  z-index 9
  box-shadow: 3px 2px 4px -2px rgba(0,0,0,0.45);

  &__items
    max-height 40vh
    overflow-y scroll
    // margin-bottom 2rem

  &__item
    margin-bottom 1rem
    display flex
    padding-bottom 0.4rem

    &:not(:last-child)
      border-bottom 1px solid $grey

  &__item-title
    font-size 0.8rem
    color $dim-grey
    margin-bottom 0.4rem

  &__item-thumb
    height 3rem
    flex 0 0 20%

  &__item-image
    width 100%
    height 100%
    object-fit cover

  &__item-details
    margin-left 0.4rem

  &__item-quantity
    font-size 0.6rem
    color $dim-grey
    margin-bottom 0.4rem

  &__item-remove
    padding 0.4rem
    background $pink
    border-radius 0.2rem
    &:hover
      background lighten($pink, 20%)

  &__actions
    margin-top 2rem

  &__link
    font-size: 16px
    background: $orange
    display: block
    padding: 8px 16px
    text-align: center
    color: $dim-grey
    border-radius: 0.2rem
    font-weight bold
    &:hover
      background lighten($orange, 20%)
    &:not(:last-child)
      margin-bottom 0.8rem
</style>
