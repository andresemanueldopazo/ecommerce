import { userRepo } from '../../../user/repo';
import { authService } from '../../../user/services/auth';
import { DeleteUserInteractor } from '../../../user/useCases/deleteUser/DeleteUserInteractor';
import { DeleteUserController } from './DeleteProductController';

const deleteUserInteractor = new DeleteUserInteractor(userRepo, authService);
const deleteUserController = new DeleteUserController(deleteUserInteractor);

export { deleteUserController };
