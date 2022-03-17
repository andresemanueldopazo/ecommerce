import { DeleteUserInteractor } from './DeleteUserInteractor';
import { DeleteUserController } from './DeleteUserController';
import { userRepo } from '../../repo';
import { authService } from '../../services/auth';

const deleteUserInteractor = new DeleteUserInteractor(userRepo, authService);
const deleteUserController = new DeleteUserController(deleteUserInteractor);

export { deleteUserController };
