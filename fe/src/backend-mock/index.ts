import _ from "lodash";
import {createServer, RestSerializer} from "miragejs";
import configureRoutes from "./routes";
import domain from "./domain";

const baseUrl = "/" + _.trim(process.env.REACT_APP_API_ROOT || "api", "/");
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
        configureRoutes(this, baseUrl);
    },
});
