import { LogoutInteractor } from './LogoutInteractor';
import { userRepo } from '../../repo';
import { authService } from '../../services/auth';
import { LogoutController } from './LogoutController';

const logoutInteractor = new LogoutInteractor(userRepo, authService);
const logoutController = new LogoutController(logoutInteractor);

export { logoutController };
