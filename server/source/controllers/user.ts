import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import { Connect, Query } from '../config/mysql';
import bcrypt from 'bcrypt';
import config from '../config/config';
import jwt from 'jsonwebtoken';

const NAMESPACE = 'User';

const register = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'User Register');

    let { user_name, user_email, user_phone, user_password } = req.body;

    bcrypt
        .hash(user_password, config.saltRounds, (err, hash) => {
            console.log(hash);
            let query = `INSERT INTO user(user_name,user_email,user_phone,user_password)VALUES( '${user_name}','${user_email}','${user_phone}','${hash}' );`;
            console.log(query);

            Connect()
                .then((connection) => {
                    Query(connection, query)
                        .then((results) => {
                            logging.info(NAMESPACE, 'User Register: ', results);

                            return res.status(200).json({
                                results
                            });
                        })
                        .catch((error) => {
                            logging.error(NAMESPACE, error.message, error);

                            return res.status(200).json({
                                message: error.message,
                                error
                            });
                        })
                        .finally(() => {
                            logging.info(NAMESPACE, 'Closing connection.');
                            connection.end();
                        });
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(200).json({
                        message: error.message,
                        error
                    });
                });
        })
        .catch((err) => {
            logging.error(NAMESPACE, err.message, err);

            return res.status(200).json({
                message: err.message,
                err
            });
        });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'User Login');
    let { user_password, user_email } = req.body;

    let query = `SELECT * FROM user where user_email='${user_email}';`;
    console.log(query);

    Connect()
        .then((connection) => {
            Query(connection, query)
                .then((results: any) => {
                    logging.info(NAMESPACE, 'User Login: ', results);
                    if (results.length > 0) {
                        bcrypt.compare(user_password, results[0].user_password, (err, result) => {
                            //    checkPWD = result;
                            console.log(result);
                            if (result) {
                                console.log(results[0].user_password);
                                var token = jwt.sign({ user_name: results.user_name, user_email: results[0].user_email, user_phone: results[0].user_phone }, config.secretKey, {
                                    expiresIn: 5000
                                });

                                return res.status(200).json({
                                    token
                                });
                            } else {
                                return res.status(200).json({
                                    message: err.message,
                                    err
                                });
                            }
                        });
                    } else {
                        logging.error(NAMESPACE, 'Email  does not match');
                    }
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(200).json({
                        message: error.message,
                        error
                    });
                })
                .finally(() => {
                    logging.info(NAMESPACE, 'Closing connection.');
                    connection.end();
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(200).json({
                message: error.message,
                error
            });
        });
};

export default { register, login };
