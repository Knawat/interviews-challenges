<template lang="pug">
nav.pagination(aria-label="Pagination Navigation")
  ul.pagination__list
    li.pagination__item
      button(@click="$emit('prev')" :disabled="currentPage === 1 || paginating")
        svg.pagination__arrow(viewBox="0 0 24 24" :class="{'pagination__arrow--disabled': currentPage === 1}")
          path(fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z")
    li.pagination__item
      button(@click="$emit('next')" :disabled="currentPage === numberOfPages || paginating")
        svg.pagination__arrow(viewBox="0 0 24 24" :class="{'pagination__arrow--disabled': currentPage === numberOfPages}")
          path(fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z")
</template>

<script>
export default {
  name: "Pagination",
  props: {
    total: {
      type: Number,
      required: true
    },
    limit: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    paginating: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.total / this.limit);
    }
  }
};
</script>

<style lang="stylus" scoped>
.pagination
  text-align center
  margin 2.5rem auto

  &__list
    display inline-flex

  &__item
    padding 0 1rem

  &__arrow
    width 2.5rem
    height 2.5rem
    color $turquoise
    &--disabled
      color $dim-grey
      cursor not-allowed
</style>
