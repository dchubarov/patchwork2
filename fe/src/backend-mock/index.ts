import {createServer} from "miragejs";

createServer({
    routes() {
        this.urlPrefix = process.env.REACT_APP_API_ROOT || "/api";

        this.get("/info", (/*schema, request*/) => {
            return {
                server: "MirageJS",
                timestamp: new Date().toISOString()
            }
        });
    },

    seeds(/*server*/) {
    }
});
