const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = {
  methods: {
    passwordHash(password, salt) {
      const shaPassword = this.sha256(password);
      return bcrypt.hashSync(shaPassword, salt);
    },
    sha256(password) {
      return crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');
    },
  },
};
