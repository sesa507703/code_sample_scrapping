var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.error("This is an error from deepakmalavade")
  res.render('index', { title: 'Express' });
  
});

//c

// export to router
module.exports = router;
