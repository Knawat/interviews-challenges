const bcrypt = require("bcryptjs");
const crypto = require("crypto");

module.exports = {
  methods: {
    passwordHash(password, salt) {
      const shaPassword = this.sha256(password);
      return bcrypt.hashSync(shaPassword, salt);
    },
    sha256(password) {
      return crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
    },
    validatePassword(password, dbPassword) {
      const passwordHashed = this.sha256(password);
      const encryptedPasswordNode = dbPassword.replace("$2y$", "$2a$");
      const result = bcrypt.hashSync(passwordHashed, encryptedPasswordNode);
      return result === encryptedPasswordNode;
    },
  },
};
