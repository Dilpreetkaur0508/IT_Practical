const express= require('express');
const authController = require('../controllers/auth');

const router = express.Router();

  
router.get('/courses',authController.isLoggedIn,(req, res, next) => {
    if(req.user == undefined) {
      res.render('login');
      }
});
router.get('/viewrecords',authController.isLoggedInteacher,(req, res, next) => {
  if(req.user == undefined) {
    res.render('profile');
    }
});

router.get('/login', authController.isLoggedIn, (req, res) => {
   if(req.user == undefined) {
     res.render('login');
   }
});
router.get('/admin', authController.isLoggedInadmin, (req, res) => {
  if(req.user == undefined) {
    res.render('adminlogin');
  }

});
router.get('/loginteacher', authController.isLoggedIn, (req, res) => {
  if(req.user == undefined) {
    res.render('teacherlogin');
  }
});
router.get('/registerteacher', authController.isLoggedIn, (req, res) => {
  if(req.user == undefined) {
    res.render('teacherregister');
  }
});

router.get('/register', (req,res) => {
    res.render('register');
});

router.get('/index', (req,res) => {
    res.render('index');
});

router.get('/about', (req,res) => {
  res.render('about');
});

router.get('/contact', (req,res) => {
  res.render('contact');
});

//all courses
router.get('/all',(req,res) => {
  res.render('all');
});



//adding row
router.get('/addAF',authController.addAF , (req,res) => {
  res.render('all', {message : 'Added Successfully!'});
});
router.get('/addAS',authController.addAS , (req,res) => {
  res.render('all', {message : 'Added Successfully!'});
});
router.get('/addEU',authController.addEU , (req,res) => {
  res.render('all', {message : 'Added Successfully!'});
});
router.get('/addNA',authController.addNA , (req,res) => {
  res.render('all', {message : 'Added Successfully!'});
});
router.get('/addOC',authController.addOC , (req,res) => {
  res.render('all', {message : 'Added Successfully!'});
});
router.get('/addSA',authController.addSA , (req,res) => {
  res.render('all', {message : 'Added Successfully!'});
});

//deleting row
router.get('/delAF',authController.delAF , (req,res) => {
  res.render('all', {message : 'Deleted Successfully!'});
});
router.get('/delAS',authController.delAS , (req,res) => {
  res.render('all', {message : 'Deleted Successfully!'});
});
router.get('/delEU',authController.delEU , (req,res) => {
  res.render('all', {message : 'Deleted Successfully!'});
});
router.get('/delNA',authController.delNA , (req,res) => {
  res.render('all', {message : 'Deleted Successfully!'});
});
router.get('/delOC',authController.delOC , (req,res) => {
  res.render('all', {message : 'Deleted Successfully!'});
});
router.get('/delSA',authController.delSA , (req,res) => {
  res.render('all', {message : 'Deleted Successfully!'});
});

//sub courses
router.get('/AF', (req,res) => {
    res.render('AF');
});
router.get('/AS', (req,res) => {
    res.render('AS');
});
router.get('/EU', (req,res) => {
    res.render('EU');
});
router.get('/NA', (req,res) => {
    res.render('NA');
});
router.get('/OC', (req,res) => {
    res.render('OC');
});
router.get('/SA', (req,res) => {
    res.render('SA');
});

module.exports = router;