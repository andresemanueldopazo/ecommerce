import { GetProductByProductNameInteractor } from './GetProductByProductNameInteractor';
import { GetProductByProductNameController } from './GetProductByProductNameController';
import { productRepo } from '../../repo';

const getProductByProductNameInteractor = new GetProductByProductNameInteractor(
  productRepo,
);

const getProductByProductNameController = new GetProductByProductNameController(
  getProductByProductNameInteractor,
);

export { getProductByProductNameController };
