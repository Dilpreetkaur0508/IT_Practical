const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/loginteacher', authController.loginteacher);
router.post('/registerteacher', authController.registerteacher);
router.post('/registerteacher2', authController.registerteacher2);
router.post('/fetchStudentRecord', authController.fetchStudentRecord);
router.post('/deletestudent', authController.deletestudent);
router.post('/loginadmin', authController.loginadmin);
router.get('/logout', authController.logout);

module.exports = router;