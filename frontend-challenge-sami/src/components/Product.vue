<template lang="pug">
article.product
  button.product__add-cart-btn.product__add-cart-btn--mobile(@click="addCartItem(product)") Add to cart
  
  .product__image-wrapper
    transition(name="fade")
      .product__overlay
        .product__dimmer
        button.product__add-cart-btn.button(@click="addCartItem(product)") Add to cart
    img.product__image(:src="product.images[0] ? product.images[0] : null" :alt='product.name.en')
  
  .product__info
    h2.product__title {{'product ' + product.name.en}}
    .product__sizes
      strong.product__size(v-for="size in getProductSizes(product)" :key="size") {{size}}
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
    },
    getProductSizes(product) {
      const attributes = product.attributes;
      const getSizeAttr = attr => {
        if (attr.name && attr.name.en) {
          return attr.name.en === "Size";
        }

        return {};
      };

      const { options: localizedOptions } = (attributes &&
        attributes.find(attr => getSizeAttr(attr))) || { localizedOptions: [] };
      const options = localizedOptions.map(op => op.en);

      return options;
    }
  }
};
</script>

<style lang="stylus" scoped>
.product
  display flex
  flex-direction column
  position relative

  &__overlay
    opacity 0

  &:hover
    .product__overlay
      opacity 1
      transition all 250ms ease

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
    color $primary
    line-height 1.2
    font-size 1rem

  &__add-cart-btn
    position absolute
    top 50%
    left 50%
    transform translate3d(-50%, -50%, 0)
    padding 0.8rem 1.5rem
    transition all ease 200ms
    &:active, &:focus
      transform translate3d(-50%, -50%, 0) scale(1.2, 1.2)

    &--mobile
      top 0
      right 0
      padding 0.5rem
      transform none
      left auto
      z-index 9
      @media only screen and (min-width: 961px)
        display none

  &__dimmer
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    background black
    opacity 0.6

  &__sizes
    margin-top 0.4rem

  &__size
    margin-right 0.6rem
    color lighten($primary, 40%)
    font-size: 0.9rem
</style>
