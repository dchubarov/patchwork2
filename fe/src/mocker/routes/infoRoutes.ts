import _ from "lodash";
import {AppServer} from "../domain";

export default function infoRoutes(server: AppServer) {
    server.get("/server-info", async () => {
        return {
            server: "Mock/MirageJS",
            status: "operational",
            timestamp: _.now()
        }
    }, {timing: 0});
}
