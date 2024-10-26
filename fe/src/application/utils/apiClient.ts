import axios from "axios";
import {envGlobals} from "@/types/env";

export const createApiClient = () => axios.create({
    baseURL: "/" + envGlobals.API_ROOT,
});
