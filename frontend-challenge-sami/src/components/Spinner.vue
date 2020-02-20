<template lang="pug">
<div class="lds-dual-ring"></div>
</template>

<script>
export default {
  name: "Spinner"
};
</script>

<style lang="stylus" scoped>
.lds-dual-ring
  display: inline-block
  width: 1rem
  height: 1rem

.lds-dual-ring:after
  content: " "
  display: block
  width: 1rem
  height: 1rem
  border-radius: 50%
  border: 2px solid $dark-green
  border-color: $dark-green transparent $dark-green transparent
  animation: lds-dual-ring 1.2s linear infinite

@keyframes lds-dual-ring
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)
</style>
