var path = require("path");

module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        import: [path.resolve(__dirname, "src/assets/stylus/main")]
      }
    }
  },
  devServer: {
    proxy: {
      "/api": {
        target: "https://dev.mp.knawat.io",
        pathRewrite: { "^/api/": "/api/" },
        changeOrigin: true
      }
    }
  }
};
