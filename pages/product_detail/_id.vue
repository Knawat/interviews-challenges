<template>
  <div class="section columns">
    <div class="column"></div>
    <div class="column is-four-fifths">
      <div class="card is-clearfix columns" v-if="product.name">
        <figure class="card-image column is-one-thirds">
          <section class="hero is-medium has-carousel">
            <!-- Start Carousel -->
            <div id="carousel-demo" class="carousels">
              <img data-v-fd9472f6 :src="product.images[0]" />
            </div>
            <!-- End Carousel -->
          </section>
        </figure>
        <div class="card-content column is-two-thirds">
          <div>
            <h1 class="product_title">{{product.name.en}}</h1>
          </div>
          <div class="card-content__text">
            <p class="price">
              {{
              formatcurrency(product.variations[0].sale_price)
              }}
            </p>
          </div>
          <div class="card-content__text">
            <p class="size">Size</p>
            <div v-if="isSizeAvaliable.length > 0" class="select">
              <select>
                <option>Choose an option</option>
                <option
                  v-for="(size, index) in isSizeAvaliable[0].options"
                  :key="index"
                  v-if="size.en != undefined"
                >{{ size.en }}</option>
              </select>
            </div>
          </div>
          <div class="card-content__text columns">
            <div class="select">
              <select @change="onSelectQuantity(product.id)" v-model="selected">
                <option
                  v-for="quantity in quantityArray"
                  :key="quantity"
                  :value="quantity"
                >{{quantity}}</option>
              </select>
            </div>
            <div class>
              <button
                class="button is-primary"
                v-if="!isAddedBtn"
                @click="addToCart(product)"
              >{{ addToCartLabel }}</button>
              <button
                class="button is-text"
                v-if="isAddedBtn"
                @click="removeFromCart(product)"
              >{{ removeFromCartLabel }}</button>
            </div>
          </div>
          <div class="card-content__text">
            <p>SKU: {{product.sku}}</p>
          </div>
        </div>
      </div>
      <div v-if="product.name">
        <p class="text-center">
          <span class="additional_info">Additional information</span>
        </p>
      </div>
      <div class="left-margin">
        <div class="table-container">
          <table class="table is-bordered is-fullwidth">
            <tr
              v-for="attribute in product.attributes"
              :key="attribute.sku"
              v-if="attribute.name.en"
            >
              <td>{{attribute.name.en}}</td>
              <td>{{attributesValue(attribute.options)}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="column"></div>
  </div>
</template>

<script>
import knawatAPI from "@/packages/KnawatAPI.js";
export default {
  name: "productdetail-id",

  validate({ params }) {
    return params.id.length > 0;
  },

  data() {
    return {
      addToCartLabel: "Add to cart",
      removeFromCartLabel: "Remove from cart",
      product: {},
      selected: 1,
      quantityArray: []
    };
  },

  async mounted() {
    if (this.$route.params) {
      if (this.$route.params.product == undefined) {
        let knawatApi = new knawatAPI();
        var accessToken = await knawatApi.getAccessToken();
        if (accessToken) {
          // Get Products
          var productsApiResponse = await knawatApi.getProductsfromAPI();
          this.product = productsApiResponse.products.find(
            product => product.sku == this.$route.params.id
          );
        }
      } else {
        this.product = this.$route.params.product;
      }
      this.selected = 1;
      for (let i = 1; i <= 20; i++) {
        this.quantityArray.push(i);
      }
    }
  },
  updated() {},

  computed: {
    isAddedBtn() {
      var product = this.$store.getters.getProductById(this.product.sku);
      return product != undefined;
    },
    isSizeAvaliable() {
      return this.product.attributes.filter(el => {
        return el.name.en == "Size";
      });
    }
  },

  methods: {
    addToCart(product) {
      let data = {
        product: product,
        status: true,
        quantity: product.Selectedquantity
      };

      this.$store.commit("addToCart", data);
      this.$store.commit("setAddedBtn", data);
    },
    removeFromCart(product) {
      this.product.isAddedBtn = false;
      let data = {
        product: product,
        status: false
      };
      this.$store.commit("removeFromCart", product);
      this.$store.commit("setAddedBtn", data);
    },
    onSelectQuantity(id) {
      this.product.Selectedquantity = this.selected;
    },
    attributesValue(attribute) {
      var data;
      attribute.forEach(attr => {
        data == undefined ? (data = attr.en + ", ") : (data += attr.en + ", ");
      });
      return data.slice(0, data.length - 2);
    }
  }
};
</script>

<style lang="scss" scoped>
.card-content {
  padding: 15px 10px 15px 10px;

  &__text {
    margin: 15px 0;
  }
  &__reviews {
    display: inline-block;
    width: 100%;
    margin-bottom: 10px;
  }
}

.product_title {
  font-size: 20px;
  font-weight: 700;
}
.price {
  color: gray;
  font-size: 21px;
  font-weight: 500;
}
.size {
  font-size: 14px;
  text-transform: uppercase;
  font-weight: bold;
}
.button {
  margin: 0px 5px;
}
.left-margin {
  margin-left: -12px;
}
.text-center {
  text-align: center;
  margin: 60px 0px 30px 0px;
}
.additional_info {
  border: 2px solid;
  border-radius: 23px;
  padding: 10px;
  font-weight: 600;
}
@media screen and (max-width: 768px), print {
  .button {
    margin: 5px 0px;
  }
}
</style>
