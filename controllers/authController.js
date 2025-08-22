
const usuariosRepository = require("../repositories/usuariosRepository.js");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




const SECRET = process.env.JWT_SECRET ||  "secret";

async function login(req, res){
  
    
    const { email, senha } = req.body;


    const user = await usuariosRepository.findUserByEmail(email);

    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const isPasswordValid = await Bcrypt.compare(senha, user.senha);
    /*
    if (!isPasswordValid) {
        return next(apierrors.unauthorized("Senha incorreta"));
    }*/

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
        expiresIn: '1h'
    });

    res.status(200).json({
        message: "Login bem-sucedido",
        token: token,
        user: {
            id: user.id,
            nome: user.nome,
            email: user.email
        }
    });
}

async function signup(req, res, next){
        const { nome, email, senha } = req.body;

    const existingUser = await usuariosRepository.findUserByEmail(email);

    /*
    if (existingUser) {
        return next(apierrors.conflict("Usuário já existe"));
    }*/

    const salt = await Bcrypt.genSalt(10);

    const hashedPassword = await Bcrypt.hash(senha, salt);
    const newUser = await usuariosRepository.insertUser({
        nome,
        email,
        senha: hashedPassword
    });

    res.status(201).json(newUser);
}


module.exports = {
    login,
    signup
}

