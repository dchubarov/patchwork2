declare namespace Express {
  import { User } from '@patchwork2/shared';
  export interface Request {
    user?: User;
  }
}
