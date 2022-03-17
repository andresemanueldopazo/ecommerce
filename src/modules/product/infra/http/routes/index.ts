import express from 'express';
import { middleware } from '../../../../../shared/infra/http';
import { createProductController } from '../../../useCases/createProduct';

const productRouter = express.Router();

productRouter.post(
  '/product',
  middleware.isAuthenticated(),
  middleware.isSeller(),
  (req, res) => createProductController.execute(req, res),
);

export { productRouter };
