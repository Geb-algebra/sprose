// worker.ts
import handle from "hono-react-router-adapter/cloudflare-workers";
import server from "./app/server";

// @ts-ignore
import * as build from "./build/server";

export default handle(build, server);
