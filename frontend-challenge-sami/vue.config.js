module.exports = {
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
