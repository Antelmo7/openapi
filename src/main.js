import express from 'express';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();
const port = 3000;

const swaggerDocument = YAML.load('./openapi.yaml');

app.use(express.json());

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});