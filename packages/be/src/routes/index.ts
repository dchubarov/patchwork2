import { Router } from 'express';
import monitoringController from './monitoring';

const api = Router().use(monitoringController);

export default Router().use('/api', api);
