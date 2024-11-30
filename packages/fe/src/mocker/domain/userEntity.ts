import { Model } from 'miragejs';
import { AppRegistry, AppServer } from './index';
import { SerializerInterface } from 'miragejs/serializer';
import { Instantiate } from 'miragejs/-types';

export const USER_ENTITY_KEY = 'user';
export type UserStatus = 'active' | 'suspended';

interface UserDb {
  id: string;
  username: string;
  firstname?: string;
  lastname?: string;
  email: string;
  status: UserStatus;
}

export type UserDbModel = Instantiate<AppRegistry, typeof USER_ENTITY_KEY>;

const UserEntity = {
  models: {
    [USER_ENTITY_KEY]: Model.extend<Partial<UserDb>>({}),
  },

  factories: {},

  seeds: (server: AppServer) => {
    server.create(USER_ENTITY_KEY, {
      id: '1000',
      username: 'dime',
      firstname: 'Dmitry',
      email: 'dime@twowls.org',
      status: 'active',
    });
    server.create(USER_ENTITY_KEY, {
      id: '1001',
      username: 'monk',
      email: 'dummy@twowls.org',
      status: 'active',
    });
  },

  serializers: (baseSerializer: SerializerInterface) => ({
    [USER_ENTITY_KEY]: baseSerializer.extend?.({
      attrs: ['id', 'username', 'firstname', 'lastname', 'email'],
    }),
  }),
};

export default UserEntity;
