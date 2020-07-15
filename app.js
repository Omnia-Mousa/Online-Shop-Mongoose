const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

//OUR OWN IMPORTS FROM OUR OWN MODULES
const adminRoutes = require('./routes/admin');
const shopRouting = require('./routes/shop');
const authRouting = require('./routes/auth');
const errorController = require('./controllers/error');

const mongoose = require('mongoose')
const User = require('./models/user');
const MONGODB_URI = 'mongodb+srv://Omnia-Mousa:BSH0fE1THbkNtZzs@cluster0.qqspu.mongodb.net/OnlineShop?retryWrites=true&w=majority'

const app = express();
const store = new MongoDBStore({
  uri : MONGODB_URI,
  collection : 'sessions'
});

app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret : 'My Secret' , resave : false , saveUninitialized : false , store : store}))

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRouting);
app.use(authRouting)

app.use(errorController.get404);

//***********MONGODB DRIVER ***************/
// mongoConnect(() => {
//     app.listen(3000);
//   });

//*************** MONGOOSE ********************/
mongoose.connect(
  MONGODB_URI
  )
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
      user.save()
    }
  })
  app.listen(3000)
  
})
.catch(err => {
  console.log(err)
})