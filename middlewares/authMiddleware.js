
const jwt = require('jsonwebtoken');

const express = require('express');


function authMiddleware(req, res, next) {
    try{
        const tokenHeader = req.headers.authorization;

         if (!tokenHeader) {
            return res.status(401).json({ error: 'Token de acesso não fornecido' });

        }

        const token = tokenHeader && tokenHeader.split(' ')[1];

         if (!token) {
            return res.status(401).json({ error: 'Formato de token inválido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      

        req.user = decoded;

        next();

    }catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}

module.exports = authMiddleware;