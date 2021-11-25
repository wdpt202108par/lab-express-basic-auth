const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// render main page
router.get("/main", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("main", {user: req.session.currentUser});
  } else {
    res.redirect("/auth/signin")
  }
  
})

// render private page
router.get("/private")

module.exports = router;
