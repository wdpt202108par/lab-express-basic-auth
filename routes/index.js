const router = require("express").Router();

// home page signup 
router.get("/", (req, res, next) => {
  res.redirect("/auth/signup");
});

module.exports = router;
