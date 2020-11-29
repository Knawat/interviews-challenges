const {ServiceBroker} = require('moleculer');
const jwt = require('jsonwebtoken');

const {MoleculerClientError} = require('moleculer').Errors;
const Helper = require('../mixins/helpers.mixin');

/**
 * Handles User Authentication
 */
module.exports = {
    name: 'auth',
    mixins: [Helper, ServiceBroker],
    /**
     * Service dependencies
     */
    dependencies: ['elastic'],

    /**
     * Service settings
     */
    settings: {
        /*
         * JWT Secret to generate token
         */
        jwt_secret: process.env.JWT_SECRET || 'jwt_secret_code',
        /* JWT token expiration time (in days) */
        expire: process.env.JWT_EXPIRE || 1
    },
    actions: {
        /**
         * Login user
         *
         * @actions
         * @param {String} email - email address
         * @param {String} password - password
         *
         * @returns {Promise} API reponse with user info
         */
        login: {
            params: {
                email: {type: 'string'},
                password: {type: 'string'}
            },
            cache: false,
            handler(ctx) {
                return ctx
                    .call('users.fetch_all', ctx.params)
                    .then(async result => {
                        if ('success' in result && !result.success) {
                            throw new MoleculerClientError('Email or password is invalid!', 422, '', [
                                {
                                    field: 'email',
                                    message: 'Email or password is invalid!'
                                },
                                {
                                    field: 'success',
                                    message: false
                                }
                            ]);
                        }
                        const user = result.data[0];

                        const token = await this.generateToken(user);

                        return this.Promise.resolve({
                            success: true,
                            message: 'Login Successfull',
                            data: {
                                token: token,
                                user: user
                            }
                        });
                    })
                    .catch(err => this.handleError(err));
            }
        },
        /**
         * Register user
         *
         * @actions
         * @param {String} name - name
         * @param {String} email - email address
         * @param {String} password - password
         *
         * @returns {Promise} API reponse with message
         */
        register: {
            params: {
                name: {type: 'string'},
                email: {type: 'string'},
                password: {type: 'string'}
            },
            handler(ctx) {
                const {name, email, password} = ctx.params;
                const verificationData = {
                    email: email
                };
                let error = false;
                let text = 'Input is required';
                let field = 'Email';
                if (!name) {
                    text = 'Name is required';
                    error = true;
                    field = 'name';
                } else if (!email) {
                    text = 'Email-Address is required';
                    error = true;
                    field = 'email';
                } else if (password === '') {
                    text = 'Password is required';
                    error = true;
                    field = 'password';
                }
                if (error) {
                    throw new MoleculerClientError('Name is required!', 422, '', [
                        {
                            field: field,
                            message: text
                        },
                        {
                            field: 'success',
                            message: false
                        }
                    ]);
                }
                return ctx
                    .call('users.fetch_all', verificationData)
                    .then(result => {
                        if ('success' in result && !result.success) {
                            return this.Promise.resolve(true);
                        }
                        throw new MoleculerClientError('Email already exist!', 422, '', [
                            {
                                field: 'email',
                                message: 'Email already exist!'
                            },
                            {
                                field: 'success',
                                message: false
                            }
                        ]);
                    })
                    .then(uniqueEmail => {
                        if (!uniqueEmail) {
                            return this.Promise.reject({success: false, message: 'Email already exist!'});
                        }
                        return ctx.call('users.add', ctx.params)
                            .then(user =>
                                this.Promise.resolve({
                                    success: true,
                                    message: 'Registered successfully!',
                                    id: user._id
                                })
                            );
                    })
                    .catch(err => this.handleError(err));
            }
        },
        /**
         * Verify User with JWT token
         *
         * @actions
         * @param {String} token - JWT token
         *
         * @returns {Object} Resolved user
         */
        verifyToken: {
            cache: {
                keys: ['token'],
                ttl: 60 * 60 // expire time
            },
            params: {
                token: 'string'
            },
            handler(ctx) {
                return new this.Promise((resolve, reject) => {
                    jwt.verify(ctx.params.token, this.settings.secret, (err, decoded) => {
                        if (err) return reject(err);

                        resolve(decoded);
                    });
                })
                    .then(decoded => {
                        if (decoded.id) return decoded;
                    })
                    .catch(err => this.handleError(err));
            }
        }
    },
    methods: {

        /**
         * generate JWT token from user
         *
         * @param {Object} user
         * @returns {String} Token
         * @memberof AuthService
         */
        async generateToken(user) {
            const today = new Date()
            const exp = new Date(today)
            exp.setDate(today.getDate() + 60)
            return jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    exp: Math.floor(exp.getTime() / 1000) * this.settings.expire
                },
                this.settings.jwt_secret
            );
        }
    }
};
