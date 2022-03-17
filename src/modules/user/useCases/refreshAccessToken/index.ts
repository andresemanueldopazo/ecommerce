import { RefreshAccessToken } from './RefreshAccessTokenInteractor';
import { userRepo } from '../../repo';
import { authService } from '../../services/auth';
import { RefreshAccessTokenController } from './RefreshAccessTokenController';

const refreshAccessToken = new RefreshAccessToken(userRepo, authService);

const refreshAccessTokenController = new RefreshAccessTokenController(
  refreshAccessToken,
);

export { refreshAccessTokenController };
