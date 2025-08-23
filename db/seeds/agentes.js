/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('agentes').del()
  await knex.raw('ALTER SEQUENCE agentes_id_seq RESTART WITH 1');
  await knex('agentes').insert([
    { nome: "Roberto", dataDeIncorporacao: "2023-01-01", cargo: "Detetive"},
    { nome: "Maria", dataDeIncorporacao: "2023-02-01", cargo: "Investigadora"},
    
  ]);
};
