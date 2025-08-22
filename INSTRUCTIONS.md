## Como fazer o docker criar imagem
---

1- tenha o Docker Desktop

2- Use o comando docker-compose up -d(Tenha o arquivo docker-compose configurado)

---
## Criar migration e seeds

Primeiro instale o knex localmente com npm install knex pg

Rode npm install dotenv

Aplique as migrations que já estão configuradas com o comando: npx knex migrate:latest

Faça o mesmo para as seeds já criadas:  npx knex seed:run

## Passo a Passo para registro de usuario

Exemplo de payload
´´´
{
    "nome": "Higor",
    "email": "Higor@gmail.com", 
    "senha" : "123Webtech@"
}

´´´

Use esse payload diretamente no Postman na rota Post no seguinte caminho: http://localhost:3000/auth/register

como usuario criado vá até a rota de login: http://localhost:3000/auth/login e faça o login para ter acesso ao seu acessToken

após pegar o acessToken você vai nas rotas protegidas(Casos e Agentes) e na aba "Authorization" vai em auth type e coloca "Bearer token",
ai é só colar o token gerado que vai poder ter acesso a API com segurança.






## Pronto, Código rodando 👌




## 🚨 IMPORANTE!!!!
Levei em consideração que tenha clonado o repositorio e tem todos arquivos já configurados.

