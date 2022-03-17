import express from 'express';
import { productRouter } from '../../../../modules/product/infra/http/routes';
import { userRouter } from '../../../../modules/user/infra/http/routes';

const v1Router = express.Router();

v1Router.use('/users', userRouter);
v1Router.use('/products', productRouter);

export { v1Router };
