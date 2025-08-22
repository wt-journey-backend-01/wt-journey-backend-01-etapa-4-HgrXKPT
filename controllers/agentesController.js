const agentesRepository = require("../repositories/agentesRepository");
const { parseISO, isValid, isFuture } = require("date-fns");
const Joi = require("joi");

async function findAll(req, res) {

  const filters =  { cargo, sort } = req.query;
  const agentes = await agentesRepository.findAll(filters);

  res.status(200).json(agentes);
}

async function findById(req, res) {
  try {
    const { id } = req.params;

    const agente = await agentesRepository.findAgentById(id);
    if(!agente){
      return res.status(404).json({
        status: 404,
        message: "Agente não encontrado",
        errors: {
          id: "Nenhum agente encontrado com o ID fornecido",
        },
      });
    }
    res.status(200).json(agente);
  } catch (error) {
    return res.status(404).json({
      status: 404,
      message: "Agente não encontrado",
      errors: {
        id: "Nenhum agente encontrado com o ID fornecido",
      },
    });
  }
}
async function addAgente(req, res) {
  const agentSchema = Joi.object({
    nome: Joi.string().trim().min(1).required(),
    dataDeIncorporacao: Joi.date().iso().max("now").required(),
    cargo: Joi.string().trim().min(1).required(),
  });
  try{
    const {error, value } = agentSchema.validate(req.body);

    if(error){
      return res.status(400).json({
        status: 400,
        message: "Dados inválidos",
        errors: error.details,
      });
    }


  const agent = await agentesRepository.createAgent(value);



  return res.status(201).json(agent);


  }catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Erro ao criar agente",
      errors: {
        internal: error.message
      }
    });
  }
  
}

async function updateAgent(req, res) {
  const agentSchema = Joi.object({
    nome: Joi.string().trim().min(1).required(),
    dataDeIncorporacao: Joi.date().iso().max("now").required(),
    cargo: Joi.string().trim().min(1).required(),
  });
    const { id } = req.params;
    
     const existingAgent = await agentesRepository.findAgentById(id);
    if(!existingAgent) {
      return res.status(404).json();
    }

    const { error, value } = agentSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        status: 400,
        message: "Dados inválidos",
        errors: error.details,
      });
    }

   


    const updated = await agentesRepository.updateAgent(id, value);
    return res.status(200).json(updated);

  }


async function partialUpdate(req, res) {
  const partialSchema = Joi.object({
    nome: Joi.string().trim().min(1).optional(),
    dataDeIncorporacao: Joi.date().iso().max("now").optional(),
    cargo: Joi.string().trim().min(1).optional(),
  });


  try{
    const { id } = req.params;

  if (req.body.id && req.body.id !== id) {
    return res.status(400).json({
      status: 400,
      message: "Não é permitido alterar o campo 'id'.",
    });
  }

  const { error, value } = partialSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Payload incorreto",
      errors: {
        id: "O payload está incorreto",
      },
    });
  }

  

  const agente = await agentesRepository.findAgentById(id);

  if (!agente) {
    return res.status(404).json({
      status: 404,
      message: "Agente não encontrado",
      errors: {
        id: "O agente não foi encontrado",
      },
    });
  }

  const toUpdateAgent = {
    nome: value.nome ?? agente.nome,
    dataDeIncorporacao: value.dataDeIncorporacao ?? agente.dataDeIncorporacao,
    cargo: value.cargo ?? agente.cargo,
  };
 

  const updated = await agentesRepository.updateAgent(id, toUpdateAgent);

  return res.status(200).json(updated);
  }catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Erro ao atualizar agente",
      errors: error.details
    });
  }
  
}

async function deleteAgent(req, res) {

    const { id } = req.params;

    const existingAgent = await agentesRepository.findAgentById(id);
    if (!existingAgent){
      return res.status(404).json({
        status: 404,
        message: "Agente não encontrado",
        errors: {
          id: "Nenhum agente encontrado com o ID fornecido",
        },
      });
    }
  
  const removed = await agentesRepository.deleteAgent(id);

  if (!removed) {
    return res.status(404).json({
      status: 400,
      message: "Agente não deletado",
      errors: {
        id: "O agente não foi deletado",
      },
    });
  }



  return res.status(204).send();
}



module.exports = {
  findAll,
  findById,
  addAgente,
  updateAgent,
  partialUpdate,
  deleteAgent,
};
