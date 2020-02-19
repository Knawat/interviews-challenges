<template lang="pug">
.container
  h1.page-title Cart
  section
    ul
      li.cart-item(v-for="item in $store.getters.cartItems")
        .cart-item__image-wrapper
          img.cart-item__image(:src="item.product.images[0] ? item.product.images[0] : null" :alt="item.product.name.en")
        .cart-item__body
          h2.cart-item__title {{item.product.name.en}}

          .cart-item__actions
            button.cart-item__quantity-button.cart-item__quantity-button--remove(
              @click="$store.commit('REMOVE_CART_ITEM', item.product.sku)"
              )
              svg.cart-item__quantity-shape(viewBox='0 0 24 24')
                path(fill='#fff', d='M19,13H5V11H19V13Z')

            p.cart-item__quantity {{item.quantity}}

            button.cart-item__quantity-button.cart-item__quantity-button--add(
              @click="$store.commit('ADD_CART_ITEM', item.product)"
              )
              svg.cart-item__quantity-shape(viewBox='0 0 24 24')
                path(fill='#fff', d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z')
</template>

<script>
export default {
  name: "Cart"
};
</script>

<style lang="stylus" scoped>
.cart-item
  display flex
  margin-bottom 2.5rem

  &__image-wrapper
    flex 0 0 25%
    height 240px

  &__image
    width 100%
    height 100%
    object-fit cover
    object-position top

  &__body
    margin-left 2rem

  &__title
    font-size 1rem
    margin-top 1rem
    color $dim-grey

  &__actions
    display: flex
    align-items: center
    margin-top 1.6rem

  &__quantity
    border: 2px solid $grey
    padding: 4px 8px
    min-width: 35px
    min-height: 35px
    display: flex
    justify-content: center
    align-items: center
    margin: 0 3px
    @media only screen and (max-width: 960px)
      min-height: 25px

  &__quantity-button
    background: $pink
    display: block
    min-height: 35px
    padding: 0 12px
    min-width: 35px
    min-height: 35px
    @media only screen and (max-width: 960px)
      min-width: 20px
      min-height: 28px

    &--add
      border-top-right-radius: 30px
      border-bottom-right-radius: 30px

    &--remove
      border-top-left-radius: 30px
      border-bottom-left-radius: 30px

  &__quantity-shape
    width: 24px
    height: 24px
    @media only screen and (max-width: 960px)
      width: 20px
</style>
