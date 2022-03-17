import { getUserByUserNameInteractor } from '../getUserByUserName';
import { GetCurrentUserController } from './GetCurrentUserController';

const getCurrentUserController = new GetCurrentUserController(
  getUserByUserNameInteractor,
);

export { getCurrentUserController };
