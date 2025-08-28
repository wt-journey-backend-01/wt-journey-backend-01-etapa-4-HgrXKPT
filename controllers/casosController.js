const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");


const z = require("zod");

async function getAllCasos(req, res,next) {
  try{
    const { status, agente_id, search } = req.query;
  const filters = { status, agente_id, search }

  const casos = await casosRepository.findAll(filters);
  
  return res.status(200).json(casos);

  }catch (error) {

   next(error);
      
    };
  }


async function getCasoById(req, res, next) {

try{
const { caso_id } = req.params;

  const id = Number(caso_id);

  if (!Number.isInteger(id)) {
      return res.status(404).json({ error: "ID inválido: deve ser um número inteiro." });
    }

  const caso = await casosRepository.findCaseById(caso_id);

  if (!caso) {
    return res.status(404).json();
  };

  return res.status(200).json(caso);
 
}catch (error) {
       
        next(error);
    }
  
  
}



async function getAgenteAssociateToCase(req, res,next) {
  try{

    const { caso_id } = req.params;

  const id = Number(caso_id);
  if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "ID inválido: deve ser um número inteiro." });
    }

    const caso = await casosRepository.findCaseById(caso_id);

    if (!caso) {
    return res.status(404).json({ message: "Caso não encontrado" });
  }
    const agente = await agentesRepository.findAgentById(caso.agente_id);
    if(!agente){
      return res.status(404).json({
        status: 404,
        message: "Agente não encontrado"
      });
    }
    return res.status(200).json(agente);

  }catch (error){
      next(error);
  }

}

async function createCase(req, res,next) {

   const createSchema = z.object({
    titulo: z.string().min(1, "Titulo Obrigatorio"),
    descricao: z.string().min(1, "Descrição Obrigatoria"),
   status: z.enum(["aberto", "solucionado"]),
    agente_id: z.number().min(1)
}).strict();
  

  try{
    const validatedData = createSchema.safeParse(req.body);

      if(!validatedData.success){
    return res.status(400).json({
      status: 400,
      message: "Payload incorreto"
    })
   }

  const existingAgent = await agentesRepository.findAgentById(validatedData.data.agente_id);
  if (!existingAgent) {
    return res.status(404).json({
      status: 404,
      message: "Agente não encontrado",
      errors: {
        agente_id: "O agente responsável não foi encontrado",
      },
    })
  };

  const createdCase =  await casosRepository.createCase(validatedData.data);

  if(!createdCase){
    res.status(400).json({
      status: 400,
      message: "Erro ao criar caso"
    })
  }

   return res.status(201).json(createdCase);

} catch (error) {
  next(error);
  
}}

async function updateCase(req, res,next) {

const updateSchema = z.object({
    titulo: z.string().min(1, "Titulo Obrigatorio"),
    descricao: z.string().min(1, "Descrição Obrigatoria"),
   status: z.enum(["aberto", "solucionado"]),
    agente_id: z.number().min(1)
}).strict();
  


try{
 const { caso_id } = req.params;

  const id = Number(caso_id);
  if (!Number.isInteger(id)) {
      return res.status(404).json({ 
        status: 404,
        message: "ID Invalido"
       });
    }



  const validatedData = updateSchema.safeParse(req.body);

      if(!validatedData.success){
    return res.status(400).json({
      status: 400,
      message: "Payload incorreto"
    })
   }


  const existingCase = await casosRepository.findCaseById(caso_id);

  if (!existingCase) {
    return res.status(404).json({
      status: 404,
      message: "Caso não encontrado",
      errors: {
        caso_id: "Nenhum caso encontrado com o ID fornecido",
      },
    });
  };

  

    const agentExists = await agentesRepository.findAgentById(validatedData.data.agente_id);

    if (!agentExists) {
      return res.status(404).json({
        status: 404,
        message: "Agente não encontrado",
      });
    }



  const updated = await casosRepository.updateCase(caso_id, validatedData.data);
  return res.status(200).json(updated);
}catch (error){
    next(error);
}
   
  

  
}

async function  partialUpdateCase(req, res,next) {

  const updateSchema = z.object({
    titulo: z.string().min(1, "Titulo Obrigatorio").optional(),
    descricao: z.string().min(1, "Descrição Obrigatoria").optional(),
   status: z.enum(["aberto", "solucionado"]).optional(),
    agente_id: z.number().min(1).optional()
}).strict()
  .refine(obj => Object.keys(obj).length>0,{
    message: "Pelo menos um campo deve ser preenchido"
  });;
    

  try{
      const { caso_id } = req.params;

  const id = Number(caso_id);
  if (!Number.isInteger(id)) {
      return res.status(404).json({ error: "ID inválido: deve ser um número inteiro." });
    }

  const validatedData = updateSchema.safeParse(req.body);
    if(!validatedData.success){
    return res.status(400).json({
      status: 400,
      message: "Payload incorreto"

    })
   }


  const existingCase = await casosRepository.findCaseById(caso_id);
  if (!existingCase) {
    return res.status(404).json({
      status: 404,
      message: "Caso não encontrado",
      errors: {
        caso_id: "Nenhum caso encontrado com o ID fornecido",
      },
    });
  };


  if (validatedData.data.agente_id) {
    const agentExists = await agentesRepository.findAgentById(validatedData.data.agente_id);
    if (!agentExists) {
      return res.status(404).json({
        status: 404,
        message: `Agente responsável não encontrado`,
      });
    }
  };

 

  const updated = await casosRepository.updateCase(caso_id, validatedData.data);

  return res.status(200).json(updated);

  }catch (error) {
    next(error);
  }
  
}

async function deleteCase(req, res) {
  try{
const { caso_id } = req.params;

  const id = Number(caso_id);
  if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "ID inválido: deve ser um número inteiro." });
    }
 

  const removed = await casosRepository.deleteCase(caso_id);
  if (!removed) {
    return res.status(404).json({
      status: 404,
      message: "Parâmetros inválidos",
      errors: {
        caso_id: "O caso não foi encontrado' ",
      },
    });
  };

  return res.status(204).send();
}catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCasos,
  getCasoById,
  createCase,
  updateCase,
   partialUpdateCase,
  deleteCase,
  getAgenteAssociateToCase,
};
