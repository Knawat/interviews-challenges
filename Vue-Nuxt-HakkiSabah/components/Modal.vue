<template>
  <v-row justify="space-around">
    <v-col cols="auto">
      <v-dialog
        v-model="dialog"
        transition="dialog-bottom-transition"
        max-width="600"
        @click:outside="$emit('dialog',false)"
      >
        <v-card>
          <v-toolbar
            color="primary"
            dark
          >
            Opening from the bottom
          </v-toolbar>
          <Modaldetail :product-detail="modalProduct" />
          <v-card-actions class="justify-end">
            <v-btn
              text
              @click="$emit('dialog',false)"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script lang='ts'>
import Vue, { PropOptions } from 'vue'
import { product } from '~/store/models/cart'
import Modaldetail from '~/components/Modaldetail.vue'

export default Vue.extend({
  name: 'Modal',
  components: { Modaldetail },
  props: {
    modalProduct: {
      type: Object,
      default: {} as product
    } as PropOptions<product>,
    dialog: {
      type: Boolean,
      default: false
    } as PropOptions<boolean>
  }
})
</script>

<style scoped>

</style>
