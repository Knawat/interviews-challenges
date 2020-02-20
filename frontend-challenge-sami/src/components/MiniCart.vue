<template lang="pug">
.cart
  ul.cart__items
    li(v-if="$store.getters.isEmptyCart"): p Cart is empty
    
    li.cart__item(v-for="item in $store.getters.getCartItems" :key="item.product.sku")
      .cart__item-thumb
        img.cart__item-image(:src="item.product.images[0] ? item.product.images[0] : null" :alt='item.product.name.en')
      .cart__item-details
        p.cart__item-title {{item.product.name.en}}
        .cart__item-footer
          p.cart__item-quantity Quantity: {{item.quantity}}
          button.cart__item-remove(@click="removeCartItem(item.product.sku)") Remove
  
  .cart__actions(v-if="!$store.getters.isEmptyCart")
    router-link.cart__link(to="#") Checkout
    router-link.cart__link(to="/cart") View Cart
</template>

<script>
export default {
  name: "MiniCart",
  methods: {
    removeCartItem(sku) {
      this.$store.commit("REMOVE_CART_ITEM", sku);
      this.$store.commit("SAVE_CART");
    }
  }
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
  z-index 99
  box-shadow: 3px 2px 4px -2px rgba(0,0,0,0.45)

  &__items
    max-height 40vh
    overflow-y scroll

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

  &__item
    margin-bottom 1rem
    display flex
    padding-bottom 0.4rem
    padding-right 1rem

    &:not(:last-child)
      border-bottom 1px solid $silver

    &-title
      font-size 0.8rem
      color $dim-grey
      margin-bottom 0.4rem

    &-thumb
      height 3rem
      flex 0 0 20%

    &-image
      width 100%
      height 100%
      object-fit cover

    &-details
      margin-left 0.4rem
      flex 1

    &-footer
      display flex
      justify-content space-between

    &-quantity
      font-size 0.6rem
      color $dim-grey
      margin-bottom 0.4rem

    &-remove
      border-radius 0.2rem
      font-weight bold
      color $maroon
      transition all 200ms ease
      &:hover
        color lighten($maroon, 20%)
      &:active
        transform scale(1.1)
</style>
