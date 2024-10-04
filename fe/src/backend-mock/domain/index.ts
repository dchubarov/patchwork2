import {Registry} from "miragejs/-types";
import Schema from "miragejs/orm/schema";
import {Server} from "miragejs/server";
import {SerializerInterface} from "miragejs/serializer";
import UserEntity from "./userEntity";

const models = {
    ...UserEntity.models,
}

const factories = {
    ...UserEntity.factories,
}

export type AppModels = typeof models;
export type AppFactories = typeof factories;
export type AppRegistry = Registry<AppModels, AppFactories>;
export type AppSchema = Schema<AppRegistry>;
export type AppServer = Server<AppRegistry>;

function configureSerializers(baseSerializer: SerializerInterface) {
    return {
        ...UserEntity.serializers(baseSerializer),
    }
}

function configureSeeds(server: AppServer) {
    UserEntity.seeds(server);
}

const defaultExports = {
    models,
    factories,
    configureSerializers,
    configureSeeds
}

export default defaultExports;
