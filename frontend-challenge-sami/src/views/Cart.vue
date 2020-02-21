<template lang="pug">
.container
  h1.page-title Cart
  section
    ul
      li(v-if="$store.getters.isEmptyCart")
        p Your cart is empty.
        router-link.cart__cta.button(to="/") Shop now!
  
      li.cart-item(v-for="item in $store.getters.getCartItems" :key="item.product.sku")
        .cart-item__image-wrapper
          img.cart-item__image(:src="item.product.images[0] ? item.product.images[0] : null" :alt="item.product.name.en")
        .cart-item__body
          h2.cart-item__title {{item.product.name.en}}

          .cart-item__actions
            button.cart-item__quantity-button.cart-item__quantity-button--remove(
              @click="removeCartItem(item.product.sku)"
              )
              svg.cart-item__quantity-shape(viewBox='0 0 24 24')
                path(fill='#fff', d='M19,13H5V11H19V13Z')

            p.cart-item__quantity {{item.quantity}}

            button.cart-item__quantity-button.cart-item__quantity-button--add(
              @click="addCartItem(item.product)"
              )
              svg.cart-item__quantity-shape(viewBox='0 0 24 24')
                path(fill='#fff', d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z')
</template>

<script>
export default {
  name: "Cart",
  methods: {
    removeCartItem(sku) {
      this.$store.commit("REMOVE_CART_ITEM", sku);
      this.$store.commit("SAVE_CART");
    },
    addCartItem(product) {
      this.$store.commit("ADD_CART_ITEM", product);
      this.$store.commit("SAVE_CART");
    }
  }
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
    color $primary

  &__actions
    display: flex
    align-items: center
    margin-top 1.6rem

  &__quantity
    border: 2px solid $silver
    padding: 0.2rem 0.5rem
    min-width: 3rem
    min-height: 2.2rem
    display: flex
    justify-content: center
    align-items: center
    margin: 0 1px
    @media only screen and (max-width: 960px)
      min-height: 1.6rem

  &__quantity-button
    background: $secondary
    display: block
    min-height: 35px
    padding: 0 0.5rem
    min-width: 3rem
    min-height: 2.2rem
    &:hover
      background: lighten($secondary, 20%)

    @media only screen and (max-width: 960px)
      min-width: 1.2rem
      min-height: 1.6rem

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

.cart__cta
  display: inline-block
  margin-top: 1.2rem
</style>
