
const tokenUtils = require('../utils/tokenUtils');

function authMiddleware(req, res, next) {
    try {
        console.log('Headers recebidos:', req.headers);
        
        const tokenHeader = req.headers['authorization'];
        
        if (!tokenHeader) {
            console.log('Nenhum token fornecido');
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const token = tokenHeader && tokenHeader.split(' ')[1];
        
        if (!token) {
            console.log('Formato de token inválido');
            return res.status(401).json({ error: 'Formato de token inválido' });
        }

        console.log('Token recebido:', token);
        
        const decoded = tokenUtils.verifyAccessToken(token);
        console.log('Token decodificado:', decoded);
        
        req.user = decoded;
        next();
        
    } catch (error) {
        console.error('Erro no middleware:', error.message);
        return res.status(401).json({ error: 'Token inválido: ' + error.message });
    }
}

module.exports = authMiddleware;