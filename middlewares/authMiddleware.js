
const jwt = require('jsonwebtoken');

const express = require('express');


function authMiddleware(req, res, next) {
    try{
        const SECRET = process.env.JWT_SECRET || "secret";

        const tokenHeader = req.headers.authorization;

         if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Formato de token inválido' });
        }

        const token = tokenHeader && tokenHeader.split(' ')[1];

         if (!token) {
            return res.status(401).json({ error: 'Formato de token inválido' });
        }

        const decoded = jwt.verify(token, SECRET);
      

        req.user = decoded;

        next();

    }catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}

module.exports = authMiddleware;