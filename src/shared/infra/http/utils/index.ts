import { authService } from '../../../../modules/user/services/auth';
import { Middleware } from './Middleware';

const middleware = new Middleware(authService);

export { middleware };
