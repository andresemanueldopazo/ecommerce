import { typeormConnection } from '../../../shared/infra/database/typeormConnection';
import { TypeormProductRepo } from '../infra/database/TypeormProductRepo';

const productRepo = new TypeormProductRepo(typeormConnection);

export { productRepo };
