const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

//OUR OWN IMPORTS FROM OUR OWN MODULES
const adminRoutes = require('./routes/admin');
const shopRouting = require('./routes/shop');
const errorController = require('./controllers/error');

const mongoose = require('mongoose')
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById('5f0d421fdbbc022258b1a2a7')
    .then(user => {
      req.user = user
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRouting);

app.use(errorController.get404);

//***********MONGODB DRIVER ***************/
// mongoConnect(() => {
//     app.listen(3000);
//   });

//*************** MONGOOSE ********************/
mongoose.connect('mongodb+srv://Omnia-Mousa:BSH0fE1THbkNtZzs@cluster0.qqspu.mongodb.net/OnlineShop?retryWrites=true&w=majority')
.then(result => {
  User.findOne().then(user => {
    if(!user){
      const user = new User({
        name : 'omnia',
        email : 'omnia@test.com',
        cart : {
          items : []
        } 
      })
    }
    user.save()
    app.listen(3000)
  })
  
})
.catch(err => {
  console.log(err)
})