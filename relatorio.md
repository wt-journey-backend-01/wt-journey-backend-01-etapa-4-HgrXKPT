<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 9 créditos restantes para usar o sistema de feedback AI.

# Feedback para HgrXKPT:

Nota final: **27.5/100**

# Feedback para HgrXKPT 🚀 - Segurança e Autenticação na API REST

Olá, HgrXKPT! Primeiramente, parabéns pelo esforço e pela entrega do seu projeto! 🎉 Você já implementou várias funcionalidades importantes, como o cadastro e login de usuários com JWT, proteção das rotas de agentes e casos, e a organização geral do projeto está bem encaminhada. Isso é uma base excelente para construir uma aplicação segura e profissional!

---

## 🌟 O que você mandou muito bem

- **Estrutura do projeto organizada:** Você manteve uma boa organização dos arquivos, com controllers, repositories, rotas e db, o que facilita a manutenção e escalabilidade do código.
- **Implementação de autenticação básica:** O login e cadastro de usuários estão funcionando, com hash de senha usando bcrypt e geração de token JWT.
- **Proteção das rotas /agentes e /casos:** Você aplicou um middleware para proteger essas rotas, garantindo que só usuários autenticados possam acessá-las.
- **Uso de variáveis de ambiente:** O segredo JWT está sendo buscado do `.env`, o que é uma ótima prática de segurança.
- **Documentação Swagger:** Você já tem endpoints documentados, o que é ótimo para consumo da API.

Além disso, você conseguiu implementar alguns bônus, como a filtragem de casos por status, agente e palavras-chave, e a busca do agente responsável por um caso. Isso demonstra que você está indo além do básico, parabéns! 🌟

---

## 🚨 Pontos que precisam de ajustes para garantir a segurança e qualidade da API

### 1. Validação do cadastro de usuários (signup) está ausente ou incompleta

Ao analisar o seu `authController.js`, percebi que no método `signup` você não está validando os dados de entrada. Isso faz com que usuários possam ser criados com campos vazios, senhas fracas ou formatos inválidos. Por exemplo, não há validação para:

- Nome vazio ou nulo
- Email inválido ou vazio
- Senha com menos de 8 caracteres, sem letras maiúsculas, minúsculas, números e caracteres especiais
- Campos extras ou faltantes

Isso é crucial para a segurança e integridade dos dados, além de atender ao requisito do desafio.

**Trecho do seu código atual:**

```js
async function signup(req, res, next){
    const { nome, email, senha } = req.body;

    const existingUser = await usuariosRepository.findUserByEmail(email);

    const salt = await Bcrypt.genSalt(10);
    const hashedPassword = await Bcrypt.hash(senha, salt);
    const newUser = await usuariosRepository.insertUser({
        nome,
        email,
        senha: hashedPassword
    });

    res.status(201).json(newUser);
}
```

**O que falta:**

- Um esquema de validação usando Joi ou Zod para garantir que o payload esteja correto antes de criar o usuário.
- Retornar erro 400 com mensagens claras quando os dados forem inválidos.

**Exemplo de validação usando Joi que você pode usar:**

```js
const Joi = require('joi');

const signupSchema = Joi.object({
  nome: Joi.string().trim().min(1).required(),
  email: Joi.string().email().required(),
  senha: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])'))
    .required()
});

async function signup(req, res, next) {
  const { error, value } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Dados inválidos no cadastro",
      errors: error.details,
    });
  }

  const existingUser = await usuariosRepository.findUserByEmail(value.email);
  if (existingUser) {
    return res.status(400).json({
      status: 400,
      message: "Email já está em uso",
    });
  }

  const salt = await Bcrypt.genSalt(10);
  const hashedPassword = await Bcrypt.hash(value.senha, salt);

  const newUser = await usuariosRepository.insertUser({
    nome: value.nome,
    email: value.email,
    senha: hashedPassword,
  });

  res.status(201).json(newUser);
}
```

Esse ajuste vai garantir que seu endpoint de registro siga as regras de negócio e de segurança exigidas.

---

### 2. Respostas do login não seguem o formato esperado

No seu `authController.js`, o endpoint de login está retornando o token e dados do usuário, mas o desafio pede que o token seja retornado em um objeto com a chave `acess_token` (com "c") e status code 200, sem mensagens extras.

**Seu código atual:**

```js
res.status(200).json({
    message: "Login bem-sucedido",
    token: token,
    user: {
        id: user.id,
        nome: user.nome,
        email: user.email
    }
});
```

**O formato esperado:**

```json
{
  "acess_token": "token aqui"
}
```

**Como corrigir:**

```js
res.status(200).json({
  acess_token: token
});
```

Isso é importante para que clientes da API consigam consumir o token corretamente.

---

### 3. Rotas de autenticação usam nomes inconsistentes

No arquivo `routes/authRoutes.js`, você definiu as rotas de autenticação como:

```js
routes.post('/login', authController.login);
routes.post('/signup', authController.signup);
```

Porém, no enunciado, o caminho para registro é `/auth/register` e para logout `/auth/logout`. Além disso, o endpoint de logout não está implementado.

**Sugestão:**

- Renomear `/signup` para `/register` para seguir o padrão.
- Implementar o endpoint `/auth/logout` para invalidar o token (mesmo que seja apenas no front-end, ou usando uma blacklist).

---

### 4. Middleware de autenticação não está na pasta correta e pode conter erros

Notei que o middleware de autenticação está na pasta `middleware/authMiddleware.js`, mas a estrutura esperada é `middlewares/authMiddleware.js` (plural).

Além disso, você não enviou o conteúdo deste middleware para análise, mas ele é fundamental para proteger as rotas e validar o JWT corretamente.

**Verifique:**

- Se o middleware está no caminho correto (plural: `middlewares/`)
- Se o middleware valida o token JWT do header `Authorization: Bearer <token>`
- Se ele adiciona os dados do usuário autenticado em `req.user`
- Se ele retorna status 401 quando o token é inválido ou ausente

---

### 5. Falta de tratamento para erros nas rotas de autenticação

No seu `authController.js`, você comentou trechos que deveriam retornar erros quando a senha está incorreta ou o usuário já existe. Isso pode fazer com que o servidor retorne respostas erradas ou até mesmo erros não tratados.

Exemplo:

```js
/*
if (!isPasswordValid) {
    return next(apierrors.unauthorized("Senha incorreta"));
}*/

/*
if (existingUser) {
    return next(apierrors.conflict("Usuário já existe"));
}*/
```

**Recomendo:**

- Implementar tratamento de erros usando seu middleware `errorHandler` para retornar respostas apropriadas.
- Retornar status 400 ou 401 com mensagens claras para o cliente.

---

### 6. Documentação incompleta para autenticação e uso do token JWT

Seu arquivo `INSTRUCTIONS.md` não contém informações sobre como registrar, fazer login, enviar o token JWT no header `Authorization` e o fluxo esperado de autenticação.

Essa documentação é essencial para que qualquer consumidor da API saiba como autenticar e acessar as rotas protegidas.

---

### 7. Outros detalhes para melhorar

- No arquivo `repositories/usuariosRepository.js`, o método `insertUser` está retornando um array com o usuário inserido (por causa do `.returning('*')`), mas no controller você está retornando esse array diretamente. É melhor retornar o primeiro elemento para evitar enviar um array no JSON.

Exemplo:

```js
async function insertUser(userData){
    const [user] = await db('usuarios').insert(userData).returning('*');
    return user;
}
```

- O mesmo vale para os métodos de update e delete, para garantir que o retorno seja consistente.

---

## 📚 Recursos que recomendo para você aprimorar seu projeto

- Sobre validação e boas práticas no cadastro de usuários e autenticação, dê uma olhada neste vídeo, feito pelos meus criadores, que fala muito bem sobre segurança:  
  https://www.youtube.com/watch?v=Q4LQOfYwujk

- Para entender melhor o uso do JWT na prática, este vídeo é excelente:  
  https://www.youtube.com/watch?v=keS0JWOypIU

- Se quiser aprofundar no uso do bcrypt e JWT juntos, este vídeo traz dicas valiosas:  
  https://www.youtube.com/watch?v=L04Ln97AwoY

- Para organizar seu projeto com a arquitetura MVC e melhorar a estrutura do código, este vídeo é muito útil:  
  https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s

- Caso tenha dúvidas na configuração do banco de dados com Docker e Knex, recomendo este tutorial completo:  
  https://www.youtube.com/watch?v=uEABDBQV-Ek&t=1s

---

## 📋 Resumo dos principais pontos para focar e melhorar

- [ ] Implementar validação robusta no cadastro de usuários (`signup`) para nome, email, senha (com regras de complexidade) e campos extras.
- [ ] Ajustar o formato da resposta do login para retornar `{ acess_token: "token" }` com status 200.
- [ ] Padronizar as rotas de autenticação para `/auth/register`, `/auth/login` e implementar `/auth/logout`.
- [ ] Corrigir a estrutura de pastas para que o middleware de autenticação fique em `middlewares/authMiddleware.js`.
- [ ] Garantir que o middleware de autenticação valide o JWT corretamente e retorne 401 quando necessário.
- [ ] Tratar erros no controller de autenticação para enviar respostas claras e corretas.
- [ ] Documentar no `INSTRUCTIONS.md` o fluxo de autenticação, exemplos de uso do token JWT e endpoints de registro/login/logout.
- [ ] Ajustar os métodos do repositório de usuários para retornar objetos (não arrays) nas operações de insert e update.

---

## Finalizando...

Você está no caminho certo para criar uma API segura e funcional! 💪 Com esses ajustes, sua aplicação vai estar muito mais robusta, alinhada com as melhores práticas de segurança e pronta para produção. Continue firme, revise cada ponto com calma e não hesite em testar bastante para garantir que tudo funcione como esperado. Estou aqui torcendo pelo seu sucesso e à disposição para ajudar sempre que precisar! 🚓👮‍♂️✨

Bons códigos e até a próxima! 👋😊

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>