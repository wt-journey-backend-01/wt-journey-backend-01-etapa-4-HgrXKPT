/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('usuarios').del()
  await knex('usuarios').insert([

    {nome: "Pedro", email: "pedro@gmail.com", senha: "hashed_password_1"},
    {nome: "Ruan", email: "ruan@gmail.com", senha: "hashed_password_2"}
  
    
  ]);
};
