import { Router } from 'express';
import monitoringController from './monitoring';
import authController from './auth';
import userController from './user';

const api = Router()
  .use(monitoringController)
  .use(authController)
  .use(userController);

export default Router().use('/api', api);
