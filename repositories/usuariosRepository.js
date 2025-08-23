
const db = require('../db/db');


async function findUserByEmail(nome){
    try{
        const query = db('usuarios');
    return await query.where({nome}).first();

    }catch (error) {
        throw new Error('Erro ao buscar usuario pelo nome: ' + error.message);
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