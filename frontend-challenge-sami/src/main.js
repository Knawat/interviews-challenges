import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { ApiPlugin } from "./api/plugin";

Vue.config.productionTip = false;
Vue.use(ApiPlugin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
