import { GetUserByUserNameInteractor } from './GetUserByUserNameInteractor';
import { GetUserByUserNameController } from './GetUserByUserNameController';
import { userRepo } from '../../repo';

const getUserByUserNameInteractor = new GetUserByUserNameInteractor(userRepo);

const getUserByUserNameController = new GetUserByUserNameController(
  getUserByUserNameInteractor,
);

export { getUserByUserNameController, getUserByUserNameInteractor };
