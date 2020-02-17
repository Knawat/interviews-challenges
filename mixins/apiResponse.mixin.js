module.exports = {
  methods: {
    success(data, message = "Ok") {
      this.logger.info(">> success : ", data);
      return {
        success: true,
        payload: data,
        message,
      };
    },
  },
};
