<template>
  <v-card class="mx-auto" max-width="400">
    <v-img class="align-end" :src="link" />
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle class="pb-0">
      Price: {{ price }}
    </v-card-subtitle>
    <v-card-text class="text--primary" v-html="desc" />
    <v-card-actions>
      <v-spacer />
      <v-btn color="blue" text @click="addProductToCart(sku)">
        Add <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    title: String,
    desc: String,
    link: String,
    price: Number,
    sku: String
  },
  methods: mapActions('cart', ['addProductToCart'])
}
</script>
