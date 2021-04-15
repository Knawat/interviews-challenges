import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers['authorization']);
    try {
        let token: any = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

        if (token) {
            if (token.startsWith('Bearer ')) token = token.slice(7, token.length);

            jwt.verify(token, config.secretKey, (err: any, decoded: any) => {
                if (err) {
                    return res.status(200).json({
                        message: err.message,
                        err
                    });
                } else {
                    // req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(200).json({
                message: 'Auth token is not supplied'
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            message: err.message,
            err
        });
    }
};

export default { verifyToken };
