/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('usuarios').del()
  await knex('usuarios').insert([

    {nome: "Pedro", email: "pedro@gmail.com", senha: "$2b$10$C1o1d/MeMmcUJerJEp1Cr.0omC/M1W5gY7MuetkBPA6U4bxgVokBG"},
    {nome: "Ruan", email: "ruan@gmail.com", senha: "$2b$10$6rwx8ri11j9YXaStDz0gCOP.u3jsXkqH4CV7UyFs6ayOnLfmOPozO"}
  
    
  ]);
};
