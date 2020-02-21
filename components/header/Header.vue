<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <nuxt-link :to="{ name: 'index' }" class="navbar-item">
          <h1 class="title is-3 is-flex-mobile"></h1>
        </nuxt-link>
        <a
          role="button"
          class="navbar-burger burger"
          @click="isMenuOpen = !isMenuOpen"
          aria-label="menu"
          aria-expanded="false"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu is-active">
        <div class="navbar-start"></div>

        <div class="navbar-end">
          <div class="navbar-item shopping-cart" @click="showCheckoutModal">
            <span class="icon">
              <i class="fa fa-shopping-cart"></i>
            </span>
            <span :class="[numProductsAdded > 0 ? 'tag is-info' : '']">
              {{
              numProductsAdded
              }}
            </span>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "VmHeader",
  data() {
    return {
      isCheckoutActive: false
    };
  },
  computed: {
    numProductsAdded() {
      return this.$store.getters.productsAdded.length;
    }
  },
  methods: {
    showCheckoutModal() {
      this.$store.commit("showCheckoutModal", true);
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  background: url("../../static/v-logo.png") no-repeat;
  background-position: 50% 50%;
  background-size: 165px;
  width: 175px;
  height: 35px;
}
.shopping-cart {
  cursor: pointer;
}
a {
  color: grey;
}
</style>
