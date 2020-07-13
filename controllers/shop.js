const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/product-list',
      {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        hasProducts: products.length > 0
      })
    })
  .catch(err => {
    console.log(err)
  })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then( product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
    })
  })
  .catch(err => {
    console.log(err)
  })

};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/index',
      {
        prods: products,
        pageTitle: 'Shop',
        path: '/shop',
        hasProducts: products.length > 0
      });
  });
};

exports.getCart = (req, res, next) => {
  req.user
  .getCart()
  .then(products => {
      res.render('shop/cart',{
          pageTitle: 'Cart',
          path: '/cart',
          products: products
        });
    })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => {
     return req.user.addToCart(product)
  })
  .then(result => {
    console.log(result)
    res.redirect('/cart');
  })
}

exports.postCartDeleteProduct = (req, res, next) =>{
  const prodId = req.body.productId;
  req.user
  .deleteCartProduct(prodId)
  .then(result =>{
    res.redirect('/cart');
  })

}

exports.postOrder = (req, res ,next) =>{
  req.user
  .addOrder()
  .then(result => {
    req.redirect('/orders');
  })
  .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
  req.user
  .getOrders()
  .then(orders => {
  res.render('shop/orders',
    {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders : orders
    });
  })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout',
    {
      pageTitle: 'Checkout',
      path: '/checkout'
    });
};