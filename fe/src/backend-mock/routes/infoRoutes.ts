import {AppServer} from "../domain";

export default function infoRoutes(server: AppServer) {
    server.get("/server-info", async () => {
        return {
            server: "Mock/MirageJS",
            timestamp: new Date().toISOString()
        }
    });
}
