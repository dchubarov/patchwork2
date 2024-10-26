import {Registry} from "miragejs/-types";
import {Server} from "miragejs/server";
import {SerializerInterface} from "miragejs/serializer";
import UserEntity from "./userEntity";
import ChecklistEntity from "./checklistEntity";

export interface EntityCommonAttributes {
    createdAt: Date,
    updatedAt: Date
}

const models = {
    ...UserEntity.models,
    ...ChecklistEntity.models,
}

const factories = {
    ...UserEntity.factories,
    ...ChecklistEntity.factories,
}

export type AppModels = typeof models;
export type AppFactories = typeof factories;
export type AppRegistry = Registry<AppModels, AppFactories>;
export type AppServer = Server<AppRegistry>;

function configureSerializers(baseSerializer: SerializerInterface) {
    return {
        ...UserEntity.serializers(baseSerializer),
        ...ChecklistEntity.serializers(baseSerializer),
    }
}

function configureSeeds(server: AppServer) {
    UserEntity.seeds(server);
    ChecklistEntity.seeds(server);
}

const defaultExports = {
    models,
    factories,
    configureSerializers,
    configureSeeds
}

export default defaultExports;
