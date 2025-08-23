
const usuariosRepository = require("../repositories/usuariosRepository.js");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenUtils = require('../utils/tokenUtils.js');

const Joi = require("joi");




async function login(req, res){
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        senha: Joi.string().min(8).required()
    }).strict();
    
    
    const { error, value } = loginSchema.validate(req.body);

    if(error){
      return res.status(400).json({
        status: 400,
        message: "Dados inválidos",
        errors: error.details,
      });
    }

    const user = await usuariosRepository.findUserByEmail(value.email);

    if (!user) {
        return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const isPasswordValid = await Bcrypt.compare(value.senha, user.senha);

    
    if (!isPasswordValid) {

       return res.status(401).json({ message: "Senha inválida" });
    }

    const accessToken = tokenUtils.generateAccessToken(user);
    const refreshToken = tokenUtils.generateRefreshToken(user);

    return res.status(200).json({
        access_token: accessToken,
        refresh_token: refreshToken
        });
}

async function refreshToken(req, res) {
try{
    const { refresh_token } = req.body;

    if (!refresh_token) {
            return res.status(400).json({ 
                message: "Refresh token é obrigatório" 
            });
        }
    
         const decoded = tokenUtils.verifyRefreshToken(refresh_token);

         const user = await usuariosRepository.findUserById(decoded.id)

         if (!user) {
            return res.status(401).json({ 
                message: "Usuário não encontrado" 
            });
        }

        const newAccessToken = tokenUtils.generateAccessToken(user);

        res.status(200).json({
            access_token: newAccessToken,
            expires_in: 900
        });
} catch (error) {
    return res.status(401).json({ 
        message: "Refresh token inválido ou expirado" 
    });
    
}
}

async function register(req, res, next){

        const createUserSchema = Joi.object(
        {
            nome: Joi.string().min(3).max(100).trim().required(),
            email: Joi.string().email().trim().required(),
            senha: Joi.string().min(8).max(255)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
            .messages({
                    'string.pattern.base': 'A senha deve conter pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial (!@#$%^&*)',
                    'string.min': 'A senha deve ter no mínimo 8 caracteres',
                    'string.max': 'A senha deve ter no máximo 255 caracteres'
            })
            .required(),
        }).strict();

    const { error, value } = createUserSchema.validate(req.body);

    if(error){
      return res.status(400).json({
        status: 400,
        message: "Dados inválidos",
        errors: error.details,
      });
    }
    
    const email = value.email.toLowerCase();
    console.log('Email convertido:', email);

    const existingUser = await usuariosRepository.findUserByEmail(email);
        console.log('Existing user:', existingUser); // DEBUG
    console.log('Tipo do existingUser:', typeof existingUser); // DEBUG

     if (existingUser && existingUser.id) {
       return res.status(400).json({
        status: 400,
        message: "Email já está em uso",
    });
    }

    const salt = await Bcrypt.genSalt(10);

    const hashedPassword = await Bcrypt.hash(value.senha, salt);

    const newUser = await usuariosRepository.insertUser({
        nome: value.nome,
        email: email,
        senha: hashedPassword
    });

   return res.status(201).json(newUser);
    
    
}

async function logout(req, res){
     try {
        // Como JWT é stateless, o logout é feito no cliente
        // Esta rota serve para informar ao cliente que deve descartar o token
        // E também pode ser usada para invalidar tokens se necessário no futuro
        
        return res.status(200).json({
            message: "Logout realizado com sucesso. Remova o token do armazenamento local."
        });
        
    } catch (error) {
    
        return res.status(500).json({
            message: "Erro interno do servidor durante o logout"
        });
    }

}


async function deleteUser(req, res){
    try {

        const {id} = req.params;

        const idNum = Number(id);
        if (!Number.isInteger(idNum)) {
            return res.status(400).json({
                status: 400,
                message: "ID inválido: deve ser um número inteiro",
            });
        }
        
        const user = await usuariosRepository.findUserById(id);

        if(!user){
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const deleted = await usuariosRepository.deleteUser(id);
        if(!deleted){
            return res.status(500).json({ message: "Erro ao deletar usuário" });
        }

        return res.status(204).send();
    

    } catch (error) {
        return res.status(500).json({
            message: "Erro interno do servidor ao deletar usuário",
            errors: {
                internal: error.message
            }
        });
    }
}

async function getLoggedUser(req, res) {
    try {
        const { id } = req.user;    

        const user = await usuariosRepository.findUserById(id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const { senha, ...userWithoutPassword } = user;

        return res.status(200).json({
            message: "Perfil do usuário",
            usuario: userWithoutPassword
        }
            
        );
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}


module.exports = {
    login,
    register,
    logout,
    deleteUser,
    refreshToken,
    getLoggedUser
}

