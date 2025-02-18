import { Hono } from "hono";

const app = new Hono();

app.use((c, next) => {
	console.log("Incoming request url", c.req.url);
	console.log("Incoming request user agent", c.req.header("User-Agent"));
	return next();
});

export default app;
