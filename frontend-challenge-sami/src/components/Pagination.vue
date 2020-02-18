<template lang="pug">
nav(aria-label="Pagination Navigation")
  ul
    li
      button(@click="$emit('prev')") Previous
    li
      button(@click="$emit('next')") Next
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
    }
  }
};
</script>
