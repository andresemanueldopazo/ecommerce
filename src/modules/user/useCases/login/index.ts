import { LoginController } from './LoginController';
import { authService } from '../../services/auth';
import { userRepo } from '../../repo';
import { LoginInteractor } from './LoginInteractor';

const loginInteractor = new LoginInteractor(userRepo, authService);
const loginController = new LoginController(loginInteractor);

export { loginController };
