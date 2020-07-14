const Product = require('../models/product');
const product = require('../models/product');

exports.getAddProduct =  (req, res, next) => {
    res.render('admin/edit-product', 
    {
      pageTitle: 'Add Product',
      path : '/admin/add-product',
      editing: false
     });
   };

exports.postAddProduct =  (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
    const product = new Product({
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
      console.log(err)
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
      product: product
    })
  })
  .catch(err => {
    console.log(err)
  })
};

exports.postEditProduct = (req, res, next) =>{
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedimageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updateddescription = req.body.description;
  
  Product.findById(prodId).then(product => {
    product.title =  updatedTitle;
    product.price =  updatedPrice ;
    product.description = updateddescription ;
    product.imageUrl = updatedimageUrl ;
    return product.save()
  })
  .then(result => {
    console.log('Edited Product');
    res.redirect('/admin/products')
  })
  .catch(err => {
    console.log(err)
  })

}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
  .then(result => {
    console.log('Destroyed Product');
    res.redirect('/admin/products')
  })
  .catch(err => {
    console.log(err)
  })
  
};

exports.getAdminProducts =  (req, res, next) => {
  Product.find()
  .then(products => {
 res.render('admin/product-list', {
  prods : products,
   pageTitle: 'Admin Product',
   path : '/admin/products',
   hasProducts: products.length > 0
  })
 })
 .catch(err => {
  console.log(err)
})
};
