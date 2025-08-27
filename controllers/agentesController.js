const agentesRepository = require("../repositories/agentesRepository");
const Joi = require("joi");
const z = require("zod");




async function findAll(req, res) {
  try{
  const { cargo, sort } = req.query;
  const filters = { cargo, sort };

  const agentes = await agentesRepository.findAll(filters);

  return res.status(200).json(agentes);

  }catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Erro ao buscar agentes",
      errors: {
        internal: error.message
      }
    });
  }
  
}

async function findById(req, res) {
  try {
    const { id } = req.params;
    
    const idNum = Number(id);

    if (!Number.isInteger(idNum)) {
      return res.status(404).json({
        status: 404,
        message: "ID inválido: deve ser um número inteiro",
      });
    }

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

    return res.status(200).json(agente);
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


  const agentSchema = z.object({
    nome: z.string().min(1, "Nome obrigatório"),
    dataDeIncorporacao: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD")
        .refine(val => new Date(val) <= new Date(), {
            message: "Data não pode ser futura"
        }),
    cargo: z.string().min(1, "Cargo obrigatório")
}).strict();

  
  try{

    const validatedData = agentSchema.safeParse(req.body);

      if(!validatedData.success){
    return res.status(400).json({
      status: 400,
      message: "Payload incorreto"
    })
   }


  const agent = await agentesRepository.createAgent(validatedData.data);

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

  
  const agentSchema = z.object({
    nome: z.string().min(1, "Nome obrigatório"),
    dataDeIncorporacao: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD")
        .refine(val => new Date(val) <= new Date(), {
            message: "Data não pode ser futura"
        }),
    cargo: z.string().min(1, "Cargo obrigatório")
}).strict();

    const { id } = req.params;

     const idNum = Number(id);

    if (!Number.isInteger(idNum)) {
      return res.status(404).json({
        status: 404,
        message: "ID inválido: deve ser um número inteiro",
      });
    }

    
     const existingAgent = await agentesRepository.findAgentById(id);
    if(!existingAgent) {
      return res.status(404).json();
    }

     const validatedData = agentSchema.safeParse(req.body);

      if(!validatedData.success){
    return res.status(400).json({
      status: 400,
      message: "Payload incorreto"
    })
   }
    
    const updated = await agentesRepository.updateAgent(id, validatedData.data);
    
    return res.status(200).json(updated);

  }


async function partialUpdate(req, res) {
    const agentSchema = z.object({
    nome: z.string().min(1, "Nome obrigatório").optional(),
    dataDeIncorporacao: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD")
        .refine(val => new Date(val) <= new Date(), {
            message: "Data não pode ser futura"
        })
        .optional(),
    cargo: z.string().min(1, "Cargo obrigatório").optional()
}).strict()
.refine(obj => Object.keys(obj).length>0,{
   message: "Pelo menos um campo deve ser preenchido"
});


  try{
    const { id } = req.params;

    const idNum = Number(id);

    if (!Number.isInteger(idNum)) {
      return res.status(404).json({
        status: 404,
        message: "ID inválido: deve ser um número inteiro",
      });
    }


   const validatedData = agentSchema.safeParse(req.body);
    if(!validatedData.success){
    return res.status(400).json({
      status: 400,
      message: "Payload incorreto"

    })
   }
   
   //
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
    nome: validatedData.data.nome ?? agente.nome,
    dataDeIncorporacao: validatedData.data.dataDeIncorporacao ?? agente.dataDeIncorporacao,
    cargo: validatedData.data.cargo ?? agente.cargo,
  };
 

  const updated = await agentesRepository.updateAgent(id, toUpdateAgent);

  return res.status(200).json(updated);
  }catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Erro ao atualizar agente",
    });
  }
  
}

async function deleteAgent(req, res) {

    const { id } = req.params;
    
     const idNum = Number(id);

    if (!Number.isInteger(idNum)) {
      return res.status(404).json({
        status: 404,
        message: "ID inválido: deve ser um número inteiro",
      });
    }



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
    return res.status(400).json({
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
