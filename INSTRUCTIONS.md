## Como fazer o docker criar imagem
---

1- tenha o Docker Desktop

1.1 Nesse projeto utilizo a porta 5434, sendo que a padrão é 5432

2- Use o comando docker-compose up -d(Tenha o arquivo docker-compose configurado)

---
## Criar migration e seeds

Primeiro instale o knex localmente com npm install knex pg

Rode npm install dotenv

Aplique as migrations que já estão configuradas com o comando: npx knex migrate:latest

Faça o mesmo para as seeds já criadas:  npx knex seed:run

## Passo a Passo para registro de usuario

## 🔐 Fluxo de Autenticação
    REGISTRO → Crie uma conta de usuário

    LOGIN → Obtenha seu token JWT

    ACESSO → Use o token em rotas protegidas

    LOGOUT → Invalide o token (client-side)


Exemplo de payload registro
´´´
{
    "nome": "Higor",
    "email": "Higor@gmail.com", 
    "senha" : "123Webtech@"
}

´´´

Requisitos da Senha:
Mínimo 8 caracteres

Pelo menos 1 letra maiúscula

Pelo menos 1 letra minúscula

Pelo menos 1 número

Pelo menos 1 caractere especial (!@#$%^&*)


Exemplo payload Login

´´´
{
    "email": "higor@gmail.com",
    "senha": "123Webtech@"
}

´´´

Logout:

Feito inteiramente pelo client-side


## 🛡️ Como Usar o Token JWT

No Postman:
Abra a requisição para uma rota protegida

Vá para a aba "Authorization"

Selecione "Bearer Token" no Type

Cole seu token no campo Token

Faça a requisição



## Pronto, Código rodando 👌




## 🚨 IMPORTANTE!!!!
Levei em consideração que tenha clonado o repositorio e tem todos arquivos já configurados.

