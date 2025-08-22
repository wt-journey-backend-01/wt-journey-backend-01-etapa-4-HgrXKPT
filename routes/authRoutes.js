
const express = require('express');
const authController = require('../controllers/authController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const usersRoutes = express.Router();


usersRoutes.post('/auth/login', authController.login);

usersRoutes.post('/auth/register', authController.register);

usersRoutes.post('/auth/logout', authMiddleware,authController.logout);

usersRoutes.post('/auth/refresh-token', authController.refreshToken);

usersRoutes.delete('/:id',authMiddleware , authController.deleteUser);

usersRoutes.get('/usuarios/me',authMiddleware, authController.getLoggedUser);




module.exports = usersRoutes;