import { CreateUserInteractor } from './CreateUserInteractor';
import { CreateUserController } from './CreateUserController';
import { userRepo } from '../../repo';

const createUserInteractor = new CreateUserInteractor(userRepo);
const createUserController = new CreateUserController(createUserInteractor);

export { createUserController };
