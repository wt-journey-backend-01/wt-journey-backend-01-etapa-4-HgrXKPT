const { th } = require("zod/locales");
const db = require("../db/db");
const  QueryExceptionError  = require("../utils/QueryExceptionError");


async function findAll(filters) {

    const query = db("agentes");

    if (filters.cargo) {
       const cargoExiste = await query
      .where('cargo', 'like', `%${filters.cargo}%`)
      .first()
      .then(result => !!result);

      if (!cargoExiste){
        throw new QueryExceptionError(`Cargo '${filters.cargo}' não encontrado.`);
      }
       query.where("cargo", "like", `%${filters.cargo}%`);
    }
    
   const validSortValues = ["dataDeIncorporacao", "-dataDeIncorporacao"];
   if (filters.sort && !validSortValues.includes(filters.sort)){
      throw new QueryExceptionError(`Parâmetro sort inválido. Valores aceitos: ${validSortValues.join(", ")}`);
   }
   

    const agentes = await query.select("*");

    if(agentes.length === 0) {
      return null; 
    }

   
    return agentes.map(agente => ({
      ...agente,
      dataDeIncorporacao: new Date(agente.dataDeIncorporacao)
        .toISOString()
        .split("T")[0]}));


}

async function findAgentById(id) {
    const agente = await db("agentes").where({ id }).first();
    
    if (!agente) return null;

    return {
        ...agente,
        dataDeIncorporacao: new Date(agente.dataDeIncorporacao).toISOString().split("T")[0]
    };
}


async function createAgent(agenteData) {

    const [createdAgent] = await db("agentes")
      .insert(agenteData)
      .returning("*");

      if (!createdAgent) {
        return null; 
      }

    return{
      ...createdAgent,
      dataDeIncorporacao: new Date(createdAgent.dataDeIncorporacao)
        .toISOString()
        .split("T")[0],
    } 
  } 


async function updateAgent(id, agenteData) {

    const [updatedAgent] = await db("agentes")
    .where({ id })
    .update(agenteData)
    .returning("*");

    if(!updatedAgent) {
      return null
    }

    const updated = {
      ...updatedAgent,
      dataDeIncorporacao: new Date(updatedAgent.dataDeIncorporacao)
        .toISOString()
        .split("T")[0],
    };

  return updated;
  }
  


async function deleteAgent(id) {
  const deleted = await db("agentes").where({ id }).del();
  if (deleted === 0) {
    return null
  }
  return true; // Retorna o número de registros deletados
}

module.exports = {
  findAll,
  findAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
};
