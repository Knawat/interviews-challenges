<template lang="pug">
article.product
  .product__image-wrapper
    img.product__image(:src="product.images[0] ? product.images[0] : null" :alt='product.name.en')
  .product__info
    h2.product__title {{'product ' + product.name.en}}
  button.product__cart-btn(@click="$store.commit('ADD_CART_ITEM', product)") Add to cart
</template>

<script>
export default {
  name: "Product",
  props: {
    product: {
      type: Object,
      required: true
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

  &__cart-btn
    position absolute
    top 0
    right 0
    background: $green
    padding 0.5rem
    border-radius 0.2rem
</style>
