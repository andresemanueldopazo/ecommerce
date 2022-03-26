import { TypeormUserRepo } from '../infra/database/TypeormUserRepo';

const userRepo = new TypeormUserRepo();

export { userRepo };
