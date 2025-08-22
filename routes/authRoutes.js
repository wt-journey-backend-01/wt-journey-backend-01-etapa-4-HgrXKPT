
const express = require('express');
const authController = require('../controllers/authController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const authRoutes = express.Router();


authRoutes.post('/login', authController.login);

authRoutes.post('/register', authController.register);

authRoutes.post('/logout', authMiddleware,authController.logout);

authRoutes.delete('/users/:id', authController.deleteUser);

authRoutes.post('/refresh-token', authController.refreshToken);

authRoutes.get('/usuarios/me',authMiddleware, authController.getLoggedUser);


module.exports = authRoutes;