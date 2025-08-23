
const jwt = require('jsonwebtoken');
const tokenUtils = require('../utils/tokenUtils');

const express = require('express');


function authMiddleware(req, res, next) {
    try{

        const tokenHeader = req.headers.authorization;

         if (!tokenHeader) {
        return res.status(401).json({ error: 'Formato de token inválido' });
        }

        const token =  tokenHeader.split(' ')[1];


        const decoded = tokenUtils.verifyAccessToken(token);
        req.user = decoded;

        next();

    }catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}

module.exports = authMiddleware;