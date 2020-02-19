module.exports = {
  methods: {
    passwordHash: jest
      .fn()
      .mockImplementationOnce((cb) => Promise.resolve(true))
      .mockImplementationOnce((cb) => Promise.resolve({}))
      .mockImplementationOnce((cb) => Promise.reject({})),
    validatePassword: jest
      .fn()
      .mockImplementationOnce((cb) => Promise.resolve(true))
      .mockImplementationOnce((cb) => Promise.resolve(false))
      .mockImplementationOnce((cb) => Promise.reject({})),
  },
};
