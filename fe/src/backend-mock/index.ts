import {createServer, JSONAPISerializer} from "miragejs";
import configureRoutes from "./routes";
import domain from "./domain";

const defaultSerializer = JSONAPISerializer;
const baseUrl = process.env.REACT_APP_API_ROOT || "api";

createServer({
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
        this.namespace = baseUrl;
        configureRoutes(this);
    },
});
