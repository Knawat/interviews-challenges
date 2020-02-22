import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { ApiPlugin } from "./api/plugin";

Vue.config.productionTip = false;

Vue.use(ApiPlugin);

Vue.filter("formatCurrency", value => {
  if (!value) return "";
  const formatCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  return formatCurrency.format(value).replace(/^(\D+)/, "$1 ");
});

Vue.filter("formatWeight", value => {
  if (!value) return "";
  const formatWeight = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  return `${formatWeight.format(value)} KG`;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
