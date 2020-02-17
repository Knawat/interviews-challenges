"use strict";

require('dotenv').config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "common",
    methods: {
        hashPassword: function (password) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
        },
        comparePassword: function (hashPassword, password) {
            return bcrypt.compareSync(password, hashPassword);
        },
        generateToken: function (user) {
            return new Promise((resolve, reject) => {
                jwt.sign({ userID: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIREIN },
                    (error, token) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(token);
                        }
                    });
            });
        },
        verifyToken: function (token) {
            return new Promise(async function (resolve, reject) {
                await jwt.verify(token, process.env.JWT_SECRET, function (
                    err,
                    res
                ) {
                    if (err) {
                        if (err.name == 'JsonWebTokenError')
                            reject({
                                message: MESSAGE_CONSTANT.INVALID_TOKEN
                            });
                        if (err.name == 'TokenExpiredError')
                            reject({
                                message: MESSAGE_CONSTANT.EXPIRED_TOKEN
                            });
                        if (err.name == 'NotBeforeError')
                            reject({
                                message: MESSAGE_CONSTANT.INACTIVE_TOKEN
                            });
                        reject({
                            message: MESSAGE_CONSTANT.AUTH_FAIL
                        });
                    }
                    resolve(res);
                });
            });
        }
    }
};