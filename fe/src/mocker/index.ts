import {createServer, RestSerializer} from "miragejs";
import {apiUrl} from "@/utils/api";
import configureRoutes from "./routes";
import domain from "./domain";
import {envGlobals} from "@/types/env";

const defaultSerializer = RestSerializer;

createServer({
    environment: envGlobals.ENV,
    models: domain.models,
    factories: domain.factories,

    serializers: {
        application: defaultSerializer,
        ...domain.configureSerializers(defaultSerializer)
    },

    seeds(server) {
        domain.configureSeeds(server);
    },

    routes() {
        configureRoutes(this, apiUrl());
    },
});
