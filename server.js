const express = require('express')

const app = express();

const errorHandler = require(`./utils/errorHandler`);
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const authMiddleware = require('./middlewares/authMiddleware');
const casosRoute = require('./routes/casosRoutes')
const agentesRoute = require('./routes/agentesRoutes')
const authRoute = require('./routes/authRoutes');



require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(express.json());


app.use('/docs',  swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth' , authRoute);

app.use('/casos',authMiddleware , casosRoute);
app.use('/agentes',authMiddleware ,agentesRoute);


app.use(errorHandler); // Middleware para lidar com erros




app.listen(port, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${port}`);
    console.log(`Documentação disponível em http://localhost:${port}/docs`);
});