const express = require('express');
const authController = require('../controllers/authController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const routes = express.Router();


 routes.delete('/:id',authMiddleware , authController.deleteUser);


 routes.get('/me',authMiddleware, authController.getLoggedUser);

module.exports = routes;