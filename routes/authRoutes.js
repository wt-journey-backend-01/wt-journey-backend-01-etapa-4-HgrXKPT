
const express = require('express');
const authController = require('../controllers/authController.js');
const routes = express.Router();


routes.post('/login', authController.login);

routes.post('/register', authController.register);

routes.post('/logout', authController.register);

routes.delete('/delete/:id', authController.deleteUser);


module.exports = routes;