import { Router } from 'express';
import monitoringController from './monitoring';
import authController from './auth';

const api = Router().use(monitoringController).use(authController);

export default Router().use('/api', api);
