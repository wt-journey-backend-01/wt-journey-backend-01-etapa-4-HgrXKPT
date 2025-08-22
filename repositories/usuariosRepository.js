
const db = require('../db/db');


async function findUserByEmail(email){
    const query = db('usuarios');

    return await query.where({ email }).first();
}


async function findUserById(id) {
    const query = db('usuarios');
    return await query.where({ id }).first();
}

async function insertUser(userData){
    const query = db('usuarios');
    return await query.insert(userData).returning('*');
}

async function updatedUser(id,userData) {
    const query = db('usuarios');
    return await query.where({ id }).update(userData).returning('*');
}

async function deleteUser(id) {
        const query = db('usuarios');
         return await query.where({ id }).del();
}





module.exports = {
    findUserByEmail,
    insertUser,
    findUserById,
    updatedUser,
    deleteUser
}