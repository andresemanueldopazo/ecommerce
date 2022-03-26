import express from 'express';
import { middleware } from '../../../../../shared/infra/http/utils';
import { createUserController } from '../../../useCases/createUser';
import { deleteUserController } from '../../../useCases/deleteUser';
import { getCurrentUserController } from '../../../useCases/getCurrentUser';
import { getUserByUserNameController } from '../../../useCases/getUserByUserName';
import { loginController } from '../../../useCases/login';
import { logoutController } from '../../../useCases/logout';
import { refreshAccessTokenController } from '../../../useCases/refreshAccessToken';

const userRouter = express.Router();

userRouter.post('/user', (req, res) => createUserController.execute(req, res));

userRouter.get('/me', middleware.isAuthenticated(), (req, res) =>
  getCurrentUserController.execute(req, res),
);

userRouter.post('/login', (req, res) => loginController.execute(req, res));

userRouter.post('/logout', middleware.isAuthenticated(), (req, res) =>
  logoutController.execute(req, res),
);

userRouter.post('/token/refresh', (req, res) =>
  refreshAccessTokenController.execute(req, res),
);

userRouter.delete('/user', middleware.isAuthenticated(), (req, res) =>
  deleteUserController.execute(req, res),
);

userRouter.get(
  '/user',
  middleware.isAuthenticated(),
  middleware.isSeller(),
  (req, res) => getUserByUserNameController.execute(req, res),
);

export { userRouter };
