
const db = require('../db/db');


async function findUserByEmail(email){
    try{
        const query = db('usuarios');
    return await query.where({ email }).first();
    
    }catch (error) {
        throw new Error('Erro ao buscar usuario pelo email: ' + error.message);
    }
    
}


async function findUserById(id) {
    try{
        const query = db('usuarios');
    return await query.where({ id }).first();
    }catch (error) {
        throw new Error('Erro ao buscar usuario pelo id: ' + error.message);
    }
    
}

async function insertUser(userData){
    try{
        const query = db('usuarios');
    const [user] = await query.insert(userData).returning('*');
    return user
    }catch (error) {
        throw new Error('Erro ao inserir usuario: ' + error.message);
    }
    
}


async function deleteUser(id) {
    try{
        const query = db('usuarios');
         return await query.where({ id }).del();
    }catch (error) {
        throw new Error('Erro ao deletar usuario: ' + error.message);
    }
        
}





module.exports = {
    findUserByEmail,
    insertUser,
    findUserById,
    deleteUser
}