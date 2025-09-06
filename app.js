if(process.env.NODE_ENV!=='production')
{
  require('dotenv').config({ quiet: true });
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const sessions = require('express-session');
const MongoStore = require('connect-mongo');
const listingsRouter=require('./routes/listing');
const reviewsRouter=require('./routes/review'); // Assuming you have a review route defined
const userRouter=require('./routes/user'); // Assuming you have a user route defined
const flash = require('connect-flash');

const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user");
// Set up session management



// Root route
app.get('/', (req, res) => {
  res.redirect('/listings');
});




const port = 8080;
// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const MONGO_URL=process.env.ATLASDB_URL;
// MongoDB connection
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log('✅ Database connection established'))
  .catch((err) => console.error('❌ Database connection error:', err));

// View engine setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// const store=MongoStore.create({
//   mongoUrl:MONGO_URL,
//   touchAfter:24*60*60,
//   crypto:{
//     secret:process.env.CLOUD_API_SECRET
   
//   }
// });

// store.on("error",function(e)
// {
//   console.log("SESSION STORE ERROR",e);
// });


const sessionOptions=
{
  secret:"process.env.SECRET",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 1000 * 60 * 60 * 24, // 1 day
    maxAge: 1000 * 60 * 60 * 24 ,// 1 day
    httpOnly: true,
  }
}
// Passport configuration
app.use(sessions(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user; // Make current user available in views
  next();
});

// demo user 
app.get("/demouser", async(req, res) => {
 let fakeUser = new User({
   email: "demo@example.com",
   username:"shreeram"
 });
let registeredUser=await User.register(fakeUser, 'hello');
res.send("Demo User created", registeredUser);
});

app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter); // Use the reviews route for listing reviews
app.use('/', userRouter); // Use the user route
// 404 handler
app.use((req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong!' } = err;
  res.render('error', { err });
  // res.status(statusCode).send(message);
});


// Server start
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

