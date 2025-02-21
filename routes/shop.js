const path = require('path');

const express = require('express');

const router = express.Router();
const isAuth = require('../middleware/is-auth')

const shopController = require('../controllers/shop');

// const rootDir = require('../util/path');
// const adminData = require('./admin');

router.get('/', shopController.getIndex);

router.get('/products' , shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart' , isAuth,shopController.getCart);

router.post('/cart', isAuth,shopController.postCart);

router.post('/cart-delete-item', isAuth,shopController.postCartDeleteProduct);

router.get('/checkout' , isAuth , shopController.getCheckout);

router.get('/orders' , isAuth,shopController.getOrders);

router.get('/orders/:orderId' , isAuth , shopController.getInvoice);



module.exports = router;
