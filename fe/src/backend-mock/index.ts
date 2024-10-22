import {createServer, RestSerializer} from "miragejs";
import {apiUrl} from "../lib/apiClient";
import configureRoutes from "./routes";
import domain from "./domain";

const defaultSerializer = RestSerializer;

createServer({
    environment: process.env.REACT_APP_ENV === "development" ? "development" : "production",
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
