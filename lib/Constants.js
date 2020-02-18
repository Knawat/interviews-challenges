const MESSAGE_CONSTANT = Object.freeze({
	NAME: "Name is required.",
	EMAIL: "Email is required.",
	PASSWORD: "Password is required.",
	TOKEN: "Token is required.",
	INVALID_TOKEN: "Token is invalid.",
	EXPIRED_TOKEN: "Token is expired.",
	INACTIVE_TOKEN: "Token is inactive.",
	AUTH_FAIL: "Authentication is failed.",
	EMAIL_EXIST: "Email is already exist.",
	USER_NOT_EXIST: "User is not found.",
	INVALID_CRED: "Invalid credentials.",
	USER_ADDED: "User added successfully.",
	USER_LOGIN: "User login successfully.",
	SOMETHING_WRONG: "Something went wrong.",
	PRODUCT_INVALID: "Product id is invalid.",
	QTN_INVALID: "Quantity is invalid.",
	PRODUCT_NOT_EXIST: "Product is not found.",
	PRODUCT_ADDED: "Product has been added to your cart.",
	CART_NOT_FOUND: "Cart details not found."
});

module.exports = MESSAGE_CONSTANT;
