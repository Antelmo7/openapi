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
const products = new Map([
  [
    1,
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Noise cancelling over-ear headphones',
      price: 149.99,
      category: 'electronics',
      tags: ['audio', 'wireless'],
      inStock: true,
      specs: {
        brand: 'SoundWave',
        color: 'black',
      },
      rating: [
        {
          score: 5,
          comments: 'Great sound quality',
        },
      ],
    },
  ],
]);
let nextUserId = 2;
let nextProductId = 2;

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

app.get('/products', (req, res) => {
  return res.json(Array.from(products.values()));
});

app.post('/products', (req, res) => {
  const product = {
    id: nextProductId,
    ...req.body,
  };

  products.set(nextProductId, product);
  nextProductId += 1;

  return res.status(201).json(product);
});

app.get('/products/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const product = products.get(id);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  return res.json(product);
});

app.patch('/products/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const product = products.get(id);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  const updatedProduct = {
    ...product,
    ...req.body,
  };

  products.set(id, updatedProduct);

  return res.json(updatedProduct);
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