
const tokenUtils = require('../utils/tokenUtils');

function authMiddleware(req, res, next) {
    try {
        
        
        const tokenHeader = req.headers['authorization'];
        
        if (!tokenHeader) {
           
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const token = tokenHeader && tokenHeader.split(' ')[1];
        
        if (!token) {
           
            return res.status(401).json({ error: 'Formato de token inválido' });
        }

        
        
        const decoded = tokenUtils.verifyAccessToken(token);
        
        
        req.user = decoded;
        next();
        
    } catch (error) {
       
        return res.status(401).json({ error: 'Token inválido: ' + error.message });
    }
}

module.exports = authMiddleware;