import {Model} from "miragejs";
import {AppServer} from "./index";
import {SerializerInterface} from "miragejs/serializer";

export type UserStatus = "active" | "suspended";

export interface UserData {
    firstname: string;
    lastname: string;
    email: string;
    status: UserStatus;
    hashedPassword: string;
}

export const USER_ENTITY_KEY = "user";

const UserEntity = {
    models: {
        [USER_ENTITY_KEY]: Model.extend<Partial<UserData>>({})
    },

    factories: {},

    seeds: (server: AppServer) => {
        server.create(USER_ENTITY_KEY, {
            firstname: "dime",
            email: "dime@twowls.org",
            status: "active",
            hashedPassword: "34982383238"
        });
    },

    serializers: (baseSerializer: SerializerInterface) => ({
        [USER_ENTITY_KEY]: baseSerializer.extend?.({
            attrs: ["firstname", "lastname", "email", "status"]
        })
    }),
}

export default UserEntity;
