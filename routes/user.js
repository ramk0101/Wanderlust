const express = require("express");
const router = express.Router({ mergeParams: true });
const user = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const { saveRedirectUrl } = require("../middleware");



router.route("/signup")
.get( (req, res) => {
  res.render("users/signup"); // Render the signup page
})
.post(
  wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const newUser = new user({ username, email });
      const registeredUser = await user.register(newUser, password);

      console.log("Newly Registered User:", registeredUser);
       req.login(registeredUser,(err)=>{
        if(err)
        {
            return next(err);
        }
         req.flash("success", "Welcome to Wanderlust!");
         res.redirect("/listings");
       });
     
    } catch (e) {
      console.error("Signup Error:", e.message);
      req.flash("error", e.message || "User already exists!");
      res.redirect("/listings");
    }
  })
);

// login route

router.route('/login')
.get((req, res) => {
  res.render("users/login"); // Render the login page
})
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to wanderlust!");
    res.redirect(res.locals.redirectUrl);
  }
);

// logout method
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout Error:", err);
      req.flash("error", "Something went wrong!");
    } else {
      req.flash("success", "logged out successfully");
    }
    res.redirect("/listings");
  });
});

module.exports = router;
