const mongoose = require('mongoose')

const Product = require('../models/product');

const fileHelper = require('../util/file');

const {validationResult} = require('express-validator/check')

exports.getAddProduct =  (req, res, next) => {
    res.render('admin/edit-product', 
    {
      pageTitle: 'Add Product',
      path : '/admin/add-product',
      editing: false,
      hasError: false,
      errorMessage: null,
      validationErrors : []
     });
   };

exports.postAddProduct =  (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
   if(!image){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError : true,
      product: {
        title : title,
        price : price,
        description : description
      },
      errorMessage : 'Attached file is not an image.',
      validationErrors : []
    })
   }
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError : true,
      product: {
        title : title,
        price : price,
        description : description
      },
      errorMessage : errors.array()[0].msg,
      validationErrors : errors.array()
    })
  }

    const imageUrl = image.path;

    const product = new Product({
      // _id : new mongoose.Types.ObjectId('5f119dfc9ca193196c12d352') ,
      title : title,
      price : price,
      description: description,
      imageUrl: imageUrl,
      userId : req.user
    });
    product.save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products')
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
  };

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then( product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      hasError: false,
      product: product,
      errorMessage : null,
      validationErrors : []
    })
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
};

exports.postEditProduct = (req, res, next) =>{
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedPrice = req.body.price;
  const updateddescription = req.body.description;
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError : true,
      product: {
        title : updatedTitle,
        price : updatedPrice,
        description : updateddescription,
        _id : prodId
      },
      errorMessage : errors.array()[0].msg,
      validationErrors : errors.array()
    })
  }
  
  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updateddescription;
      if(image){
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })

}

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).json({message : 'Succes!'})
    })
    .catch(err => {
      res.status(500).json({message : 'Deleting Product Is Failed!'})
    });
};

exports.getAdminProducts =  (req, res, next) => {
  Product.find({userId : req.user._id})
  .then(products => {
 res.render('admin/product-list', {
  prods : products,
   pageTitle: 'Admin Product',
   path : '/admin/products',
   hasProducts: products.length > 0,
  //  isAuthenticated:  req.session.loggedIn
  })
 })
 .catch(err => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
})
};
