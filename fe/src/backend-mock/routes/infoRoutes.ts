import {AppServer} from "../domain";

export default function infoRoutes(server: AppServer) {
    server.get("/server-info", async () => {
        return {
            server: "Mock/MirageJS",
            status: "operational",
            timestamp: new Date().toISOString()
        }
    }, {timing: 0});
}
