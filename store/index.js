export const state = () => ({
  products: [],
  userInfo: {
    isLoggedIn: false,
    name: "Demo user"
  },
  systemInfo: {
    openLoginModal: false,
    openCheckoutModal: false
  }
});
export const getters = {
  getproductsAdded: state => {
    return state.products;
  },
  isProductAddedIncart: state => {
    return state.products.filter(el => {
      return el.quantity;
    });
  },
  getProductById: state => sku => {
    return state.products.find(product => product.sku == sku);
  },
  isLoginModalOpen: state => {
    return state.systemInfo.openLoginModal;
  },
  isSignupModalOpen: state => {
    return state.systemInfo.openSignupModal;
  },
  isCheckoutModalOpen: state => {
    return state.systemInfo.openCheckoutModal;
  },
  quantity: state => {
    return state.products.quantity;
  }
};

export const mutations = {
  addToCart: (state, data) => {
    state.products = state.products || [];
    data.product.quantity = data.quantity || 1;
    state.products.push(data.product);
    if (localStorage) {
      localStorage["products"] = JSON.stringify(state.products);
    }
  },
  loadExistingProduct: (state, existingProducts) => {
    state.products = existingProducts;
  },
  setAddedBtn: (state, data) => {
    state.products.forEach(el => {
      if (el.sku === data.product.sku) {
        el.isAddedBtn = data.status;
      }
    });
  },
  removeFromCart: (state, product) => {
    const productIndex = state.products.findIndex(x => x.sku == product.sku);
    if (productIndex !== -1) {
      state.products.splice(productIndex, 1);
    }
    if (localStorage) {
      localStorage["products"] = JSON.stringify(state.products);
    }
  },

  isUserLoggedIn: (state, isUserLoggedIn) => {
    state.userInfo.isLoggedIn = isUserLoggedIn;
  },
  setUserName: (state, name) => {
    state.userInfo.name = name;
  },
  showLoginModal: (state, show) => {
    state.systemInfo.openLoginModal = show;
  },
  showCheckoutModal: (state, show) => {
    state.systemInfo.openCheckoutModal = show;
  },
  quantity: (state, data) => {
    const product = state.products.find(x => x.quantity === data.quantity);
    if (product) {
      product.quantity = data.quantity;
    }
  }
};
