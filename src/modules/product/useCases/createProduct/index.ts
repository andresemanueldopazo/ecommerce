import { productRepo } from '../../repo';
import { CreateProductController } from './CreateProductController';
import { CreateProductInteractor } from './CreateProductInteractor';

const createProductInteractor = new CreateProductInteractor(productRepo);
const createProductController = new CreateProductController(
  createProductInteractor,
);

export { createProductController };
