import { Middleware } from './utils/Middleware';
import { authService } from '../../../modules/user/services/auth';

const middleware = new Middleware(authService);

export { middleware };
