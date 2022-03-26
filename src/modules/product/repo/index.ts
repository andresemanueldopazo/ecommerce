import { TypeormProductRepo } from '../infra/database/TypeormProductRepo';

const productRepo = new TypeormProductRepo();

export { productRepo };
