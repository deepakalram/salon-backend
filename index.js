import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger.js';
import user_routes from './routes/web_routes/user_routes.js';
import expressCustomFunction from './common/custom_functions.js';

const app = express();
expressCustomFunction(express);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));

dotenv.config({
  path: `./env/${process.env.NODE_ENV}.env`
});
const port = process.env.PORT || 3000

app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/users', user_routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});