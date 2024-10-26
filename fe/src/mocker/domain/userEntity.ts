import {Model} from "miragejs";
import {AppServer} from "./index";
import {SerializerInterface} from "miragejs/serializer";

export type UserStatus = "active" | "suspended";

export interface UserData {
    username: string;
    firstname?: string;
    lastname?: string;
    email: string;
    status: UserStatus;
}

export const USER_ENTITY_KEY = "user";

const UserEntity = {
    models: {
        [USER_ENTITY_KEY]: Model.extend<Partial<UserData>>({})
    },

    factories: {},

    seeds: (server: AppServer) => {
        server.create(USER_ENTITY_KEY, {
            username: "dime",
            firstname: "Dmitry",
            email: "dime@twowls.org",
            status: "active"
        });
    },

    serializers: (baseSerializer: SerializerInterface) => ({
        [USER_ENTITY_KEY]: baseSerializer.extend?.({
            attrs: ["username", "firstname", "lastname", "email"]
        })
    }),
}

export default UserEntity;
