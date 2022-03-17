import { typeormConnection } from '../../../shared/infra/database/typeormConnection';
import { TypeormUserRepo } from '../infra/database/TypeormUserRepo';

const userRepo = new TypeormUserRepo(typeormConnection);

export { userRepo };
