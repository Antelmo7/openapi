import express from 'express';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import OpenApiValidator from 'express-openapi-validator';

const app = express();
const port = 3000;

const swaggerDocument = YAML.load('./openapi.yaml');

app.use(express.json());

app.use(
  OpenApiValidator.middleware({
    apiSpec: swaggerDocument,
    validateRequests: true,
    validateResponses: true,
    ignorePaths: /.*\/docs.*/
  })
);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.use('/', (req, res) => {
  res.send('API First course');
});

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});