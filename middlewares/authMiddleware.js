
const jwt = require('jsonwebtoken');
const tokenUtils = require('../utils/tokenUtils');

const express = require('express');


function authMiddleware(req, res, next) {
   

        const tokenHeader = req.headers['authorization']; 

         const token = tokenHeader && tokenHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({ error: 'Token não fornecido' });

            }


        const decoded = tokenUtils.verifyAccessToken(token);
        req.user = decoded;

        next();

    
}

module.exports = authMiddleware;