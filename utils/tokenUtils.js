const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'MySecretKey';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET || 'MyRefreshSecretKey';

// Gerar access token (15 minutos)
function generateAccessToken(user) {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.nome,
            type: 'access'
        }, 
        ACCESS_TOKEN_SECRET, 
        { expiresIn: '15m' }
    );
}

// Gerar refresh token (7 dias)
function generateRefreshToken(user) {
    return jwt.sign(
        { 
            id: user.id,
            type: 'refresh'
        }, 
        REFRESH_TOKEN_SECRET, 
        { expiresIn: '7d' }
    );
}

// Verificar access token
function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        if (decoded.type !== 'access') {
            throw new Error('Tipo de token inválido');
        }
        return decoded;
    } catch (error) {
        throw new Error('Access token inválido');
    }
}

// Verificar refresh token
function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        if (decoded.type !== 'refresh') {
            throw new Error('Tipo de token inválido');
        }
        return decoded;
    } catch (error) {
        throw new Error('Refresh token inválido');
    }
}

// Decodificar token sem verificar (apenas para leitura)
function decodeToken(token) {
    return jwt.decode(token);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    decodeToken
};