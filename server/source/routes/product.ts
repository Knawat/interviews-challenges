import express from 'express';
import controller from '../controllers/product';
import Token from '../helper/verifyToken';

const router = express.Router();

router.post('/addProduct', Token.verifyToken, controller.addProduct);
router.get('/getProduct', Token.verifyToken, controller.getProduct);

export = router;
