// export const  getFormatedCurrency(value) {
//    var  currencyFormatter = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 2
//       })

//     return this.currencyFormatter.format(value);
//   }
import Vue from "vue";
Vue.mixin({
  methods: {
    formatcurrency: str => {
      debugger;
      var currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
      return currencyFormatter.format(str);
    }
  }
});
