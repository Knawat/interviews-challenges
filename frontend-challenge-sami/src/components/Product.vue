<template lang="pug">
article.product(@mouseover="hovered = true" @mouseleave="hovered = false")
  button.product__add-cart-btn.product__add-cart-btn--mobile(@click="addCartItem(product)") Add to cart
  .product__image-wrapper

    transition(name="fade")
      .product__overlay(v-show="hovered")
        .product__dimmer
        button.product__add-cart-btn(@click="addCartItem(product)") Add to cart
    img.product__image(:src="product.images[0] ? product.images[0] : null" :alt='product.name.en')
  .product__info
    h2.product__title {{'product ' + product.name.en}}
</template>

<script>
export default {
  name: "Product",
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    hovered: false
  }),
  methods: {
    addCartItem(product) {
      this.$store.commit("ADD_CART_ITEM", product);
      this.$store.commit("SAVE_CART");
    }
  }
};
</script>

<style lang="stylus" scoped>
.product
  display flex
  flex-direction column
  position relative

  &__image-wrapper
    height 440px
    position relative

  &__image
    max-height 100%
    width 100%
    height 100%
    object-fit cover

  &__info
    padding-top 1rem
    margin-top auto

  &__title
    color $dim-grey
    line-height 1.2
    font-size 1rem

  &__add-cart-btn
    position absolute
    top 50%
    left 50%
    transform translate3d(-50%, -50%, 0)
    background: $green
    padding 1rem 1.5rem
    border-radius 0.2rem
    font-size 1rem
    font-weight bold

    &--mobile
      top 0
      right 0
      background: $green
      padding 0.5rem
      transform none
      left auto
      z-index 9
      @media only screen and (min-width: 961px)
        display none

  &__overlay
    @media only screen and (max-width: 960px)
      display none

  &__dimmer
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    background black
    opacity 0.1

.fade-enter-active, .fade-leave-active
  transition: opacity .3s

.fade-enter, .fade-leave-to
  opacity: 0
</style>
