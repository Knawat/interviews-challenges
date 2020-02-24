<template>
  <div>
    <div class="card-image">
      <figure class="image is-3by4" v-if="product.images.length > 0">
        <img :src="product.images[0]" alt="Placeholder image" class="image" />
      </figure>
      <figure class="image is-4by3" v-else>
        <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" />
      </figure>
    </div>
    <div class="card-content column">
      <div class="media">
        <div class="media-content TitleName">{{ product.name.en }}</div>
      </div>
      <div class="is-clearfix">
        <div
          class="is-pulled-left"
          v-if="
            product.variations[0].market_price <
              product.variations[0].sale_price
          "
        >
          <p>
            <span class="title is-4">
              <strong>
                <strike>
                  {{
                  formatcurrency(product.variations[0].market_price).toFixed(2)
                  }}
                </strike>
              </strong>
            </span>
          </p>
        </div>
        <p class="is-pulled-right">
          <span class="title is-4">
            <strong>
              {{
              formatcurrency(product.variations[0].sale_price)
              }}
            </strong>
          </span>
        </p>
      </div>
      <div class="is-clearfix column">
        <div v-if="isSizeAvaliable.length > 0" class="is-pulled-left">
          <span class="title is-4" v-for="(size, index) in isSizeAvaliable[0].options" :key="index">
            <button v-if="size.en != undefined" class="buttonsize button">{{ size.en }}</button>
          </span>
        </div>

        <div v-if="isSizeAvaliable.length == 0" class="is-pulled-left">
          <span class="title is-4">
            <button class="buttonsize button">Standard Size</button>
          </span>
        </div>

        <div class="select color-select" v-if="isColorOptionAvailable.length > 0">
          <p class="is-pulled-right colordropdown">
            <select>
              <option>-- Select Color --</option>
              <option v-for="(color, index) in isColorOptionAvailable[0].options" :key="index">
                <p>{{ color.en }}</p>
              </option>
            </select>
          </p>
        </div>
      </div>
      <div class="card-footer btn-actions">
        <div class="card-footer-item field is-grouped footerbtn">
          <div class="has-text-centered center">
            <div class="buttons is-inline-block margin-btn">
              <button
                class="button is-primary"
                v-if="!isProductAddedIncart"
                @click="addToCart(product)"
              >{{ addToCartLabel }}</button>
              <button
                class="button is-text"
                v-if="isProductAddedIncart"
                @click="removeFromCart(product, false)"
              >{{ removeFromCartLabel }}</button>
            </div>
            <div class="select is-rounded is-small float-right is-inline-block margin-dropdown">
              <select @change="onSelectQuantity(product.id)" v-model="selected">
                <option
                  v-for="quantity in quantityArray"
                  :value="quantity"
                  :key="quantity.id"
                >{{ quantity }}</option>
              </select>
            </div>
          </div>
          <div class="column"></div>
        </div>
      </div>
    </div>

    <nuxt-link
      class="details"
      :to="{
        name: 'product_detail-id',
        params: {
          product: product,
          id: product.sku

        }
      }"
    ></nuxt-link>
  </div>
</template>

<script>
export default {
  name: "products",
  props: ["product"],

  data() {
    return {
      addToCartLabel: "Add to cart",
      viewDetailsLabel: "Details",
      removeFromCartLabel: "Remove from cart",
      selected: 1,
      quantityArray: []
    };
  },

  mounted() {
    for (let i = 1; i <= 20; i++) {
      this.quantityArray.push(i);
    }

    if (this.$props.product.quantity > 1) {
      this.selected = this.$props.product.quantity;
    }
  },

  computed: {
    isProductAddedIncart() {
      var product = this.$store.getters.getProductById(this.$props.product.sku);
      return product != undefined;
    },
    isColorOptionAvailable() {
      return this.$props.product.attributes.filter(el => {
        return el.name.en == "Color";
      });
    },
    isSizeAvaliable() {
      return this.$props.product.attributes.filter(el => {
        return el.name.en == "Size";
      });
    }
  },

  methods: {
    addToCart(product) {
      let data = {
        product: product,
        status: true,
        quantity: this.$props.product.selectedquantity
      };

      this.$store.commit("addToCart", data);
      this.$store.commit("setAddedBtn", data);
    },
    removeFromCart(product) {
      let data = {
        product: product,
        status: false
      };
      this.$store.commit("setAddedBtn", data);

      this.$store.commit("removeFromCart", product);
    },

    onSelectQuantity(id) {
      this.$props.product.selectedquantity = this.selected;
    }
  }
};
</script>

<style lang="scss" scoped>
.details {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  &:hover {
    border: 1px solid #51bafc;
  }
}
.button,
.select {
  z-index: 2;
}

.card-content {
  padding: 0;
}
.buttons {
  margin: 0;
}
strike {
  color: gray;
}
.buttonsize {
  background-color: white;
  border-color: #dddddd;
  color: black;
  margin: 5px;
  z-index: 2;
}
.buttonsize :hover {
  background-color: #dddddd;
  z-index: 2;
}
.TitleName {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  font-size: 25px;
}
.TitleName:hover {
  overflow: visible;
}
.color-select {
  bottom: auto;
  margin: 5px;
}
.image {
  width: auto !important;
  margin-left: auto;
  margin-right: auto;
}
.center {
  width: 100%;
  display: block;
}

.margin-btn {
  margin: 0px auto;
}
.margin-dropdown {
  margin: 5px auto;
}
.footerbtn {
  display: -webkit-box;
}
@media screen and (min-width: 767px) and (max-width: 857px) {
  .colordropdown {
    font-size: 15px;
    position: relative;
    left: 8px;
  }
}
</style>
