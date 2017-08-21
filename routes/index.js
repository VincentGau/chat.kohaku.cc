var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if(!req.session.user){
    // req.flash('error', 'Not logged in!');
    return res.redirect('/login');
  }
  res.cookie('user', req.session.user);

  console.log('tttttttttttttt  ', req.session.user);
  res.render('index', { user: req.session.user });
});

router.get('/login', function(req, res, next){
  res.render('login');
});

router.post('/login', function(req, res, next) {
  console.log(req.body);
  if(req.body.username && req.body.passwd == '111111'){
      req.session.user = req.body.username;
      req.flash('success', '登录成功.');
      return res.redirect('/')
  }
  req.flash('error', '登录失败');
  res.redirect('/login');

});

router.get('/logout', function(req, res, next){
  req.session.user = null;
  req.flash('success', '已退出登录');
  res.redirect('/login')
});

// function checkLogin(res, req, next){
//   if(!req.session.user){
//     req.flash('error', 'Not logged in!');
//     return res.redirect('/login');
//   }
//   next();
// }
//
//
// function checkNotLogin(res, req, next){
//   if(req.session.user){
//     req.flash('error', 'Already logged in!');
//     return res.redirect('/')
//   }
//   next();
// }

module.exports = router;
