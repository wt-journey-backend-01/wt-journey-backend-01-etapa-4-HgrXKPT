
const express = require('express');
const authController = require('../controllers/authController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const authRoutes = express.Router();


authRoutes.post('/login', authController.login);

authRoutes.post('/register', authController.register);

authRoutes.post('/logout', authMiddleware,authController.logout);

authRoutes.post('/refresh-token', authController.refreshToken);




module.exports = authRoutes;