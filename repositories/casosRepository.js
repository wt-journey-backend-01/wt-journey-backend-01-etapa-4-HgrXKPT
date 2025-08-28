

const { tr } = require('date-fns/locale');
const db = require('../db/db');
const QueryExceptionError = require('../utils/QueryExceptionError');
const NotFoundExceptionError = require('../utils/NotFoundExceptionError');


 async function findAll(filters) {
  
     let query = db('casos');

    if(filters.status){
      
     query = query.where('status', filters.status);
    }

    if(filters.agente_id){
      
      query = query.where('agente_id', filters.agente_id);
    }

    if(filters.search){
      

      query = query.where(function() {
        this.where('titulo', 'like', `%${filters.search}%`)
            .orWhere('descricao', 'like', `%${filters.search}%`);
      });
    }
    const casos = await query.select('*');

    if(filters.status && casos.length === 0){
      throw new QueryExceptionError(`Status '${filters.status}' não encontrado.`);
    }

     if(filters.agente_id && casos.length === 0){
      throw new QueryExceptionError(`Agente com id '${filters.agente_id}' não encontrado.`);
    }

     if(filters.search && casos.length === 0){
      throw new QueryExceptionError(`titulo ou descricao '${filters.search}' não encontrado.`);
    }
 
    return casos;

   
}

 async function findCaseById(id){
 
    const query =  db("casos");

    const caso = await query.where({ id }).first();
    if(!caso){
      throw new NotFoundExceptionError("Caso não encontrado");
    }
    
    return caso;

      
  
    
   

}

async function createCase(caseData){

    const [createdCase] = await db('casos')
    .insert(caseData)
    .returning('*');

    if(!createdCase){
      throw new Error("Erro ao criar caso");
    }
    
    return createdCase

}

 async function updateCase(id, caseData){
 
    const updated = {
    ...caseData
  }
    const [updatedCase] = await db('casos')
      .where({ id })
      .update(updated)
      .returning('*');

      if(!updatedCase){
        throw new Error("Erro ao atualizar caso");
      }

 

      return updatedCase;

  
}
async function deleteCase(id){
    const query = db('casos')

    const deleted = await query.where({ id }).del();

      if(deleted === 0){
         throw new NotFoundExceptionError("Caso não encontrado");
      }
  return true; 
}



module.exports = {
    findAll,
    findCaseById,
    createCase,
    updateCase,
    deleteCase
}
