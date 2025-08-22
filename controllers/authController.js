
const usuariosRepository = require("../repositories/usuariosRepository.js");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Joi = require("joi");



const SECRET = process.env.JWT_SECRET ||  "secret";

async function login(req, res){
  
    
    const { email, senha } = req.body;


    const user = await usuariosRepository.findUserByEmail(email);

    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const isPasswordValid = await Bcrypt.compare(senha, user.senha);

    
    if (!isPasswordValid) {

       return res.status(401).json({ message: "Senha inválida" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
        expiresIn: '1h'
    });

    return res.status(200).json({
        acess_token: token
        });
}

async function register(req, res, next){

    const createUserSchema = Joi.object(
        {
            nome: Joi.string().min(3).max(100).required(),
            email: Joi.string().email().required(),
            senha: Joi.string().min(8).max(255).required()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        }
    )

    const { error, value } = createUserSchema.validate(req.body);

    if(error){
      return res.status(400).json({
        status: 400,
        message: "Dados inválidos",
        errors: error.details,
      });
    }

    const existingUser = await usuariosRepository.findUserByEmail(value.email);

     if (existingUser) {
        return res.status(400).json({
        status: 400,
        message: "Email já está em uso",
        });
    }

    const salt = await Bcrypt.genSalt(10);

    const hashedPassword = await Bcrypt.hash(value.senha, salt);

    const newUser = await usuariosRepository.insertUser({
        nome: value.nome,
        email: value.email,
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
        
        const user = await usuariosRepository.findUserById(id);

        if(!user){
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const deleted = await usuariosRepository.deleteUser(id);
        if(!deleted){
            return res.status(500).json({ message: "Erro ao deletar usuário" });
        }

        return res.status(204).json();
    

    } catch (error) {
        next(error);
    }
}


module.exports = {
    login,
    register,
    logout,
    deleteUser
}

