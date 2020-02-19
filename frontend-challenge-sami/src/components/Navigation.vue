<template lang="pug">
header.header
  .container
    nav
      ul.nav-menu
        li
          router-link.nav-menu__logo(to="/") Knawat Shop
        li
          button.nav-menu__cart-toggler(@click="showCart = !showCart")
            svg.nav-menu__cart-icon(style='width:24px;height:24px', viewBox='0 0 24 24')
              path(fill="#393535" d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z")
            p(v-if="$store.getters.cartCount").nav-menu__cart-count {{$store.getters.cartCount}}
          
          transition(name="slide")
            mini-cart(v-show="showCart")
          .dimmer(v-show="showCart" @click="showCart = false")
</template>

<script>
import MiniCart from "@/components/MiniCart";

export default {
  name: "Navigation",
  components: {
    MiniCart
  },
  data: () => ({
    showCart: false
  }),
  watch: {
    $route() {
      this.showCart = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.header
  background $grey
  padding: 1.2rem 0

.nav-menu
  display flex
  justify-content space-between

  &__logo
    font-size 1.4rem
    font-weight bold
    color $dim-grey

  &__cart-toggler
    position relative
    &:hover
      svg
        path
          fill $orange
          transition 100ms ease

  &__cart-count
    height 1rem
    width 1rem
    border-radius 50%
    background $orange
    position absolute
    right -6px
    top -6px
    display flex
    justify-content center
    align-items center

.dimmer
  position absolute
  top 0
  left 0
  bottom 0
  right 0
  z-index 8

.slide-enter, .slide-leave-to
  transform: scaleY(0)
</style>
