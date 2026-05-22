import express from 'express';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import OpenApiValidator from 'express-openapi-validator';

const app = express();
const port = 3000;

const swaggerDocument = YAML.load('./openapi.yaml');
const users = new Map([
  [1, { id: 1, name: 'Jane Doe', age: 30, email: 'jane@example.com' }],
]);
let nextUserId = 2;

app.use(express.json());

app.use(
  OpenApiValidator.middleware({
    apiSpec: swaggerDocument,
    validateRequests: true,
    validateResponses: true,
    ignorePaths: /.*\/docs.*/,
  })
);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.json('API First course');
});

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.post('/users', (req, res) => {
  const user = {
    id: nextUserId,
    ...req.body,
  };

  users.set(nextUserId, user);
  nextUserId += 1;

  res.status(201).json({
    ...user,
  });
});

app.get('/users/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const user = users.get(id);

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  return res.json(user);
});

app.patch('/users/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const user = users.get(id);

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  const updatedUser = {
    ...user,
    name: req.body.name,
  };

  users.set(id, updatedUser);

  return res.json(updatedUser);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});