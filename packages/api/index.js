const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const swaggerJsdoc = require("swagger-jsdoc");
const koaSwagger = require("koa2-swagger-ui").koaSwagger;
const Bottleneck = require("bottleneck");
const tokenRouter = require("./routes/token");
const config = require("./config");

const app = new Koa();

const limiter = new Bottleneck({
	maxConcurrent: config.api.maxConcurrent,
	minTime: config.api.minTime,
});

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "B2B API Documentation",
			version: "1.0.0",
			description: "API documentation for B2B token operations",
		},
		servers: [
			{
				url: `http://localhost:${config.api.port}`,
				description: "Local development server",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(bodyParser());

app.use(
	koaSwagger({
		routePrefix: "/swagger",
		swaggerOptions: {
			spec: swaggerSpec,
		},
	})
);

app.use(async (ctx, next) => {
	try {
		await limiter.schedule(() => next());
	} catch (error) {
		ctx.status = 429;
		ctx.body = {
			code: 429,
			response: {
				message: "Too many requests",
			},
		};
	}
});

app.use(tokenRouter.routes()).use(tokenRouter.allowedMethods());

app.on("error", (err, ctx) => {
	console.error("Server error", err, ctx);
});

const port = config.api.port || 3000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
	console.log(
		`Swagger documentation available at http://localhost:${port}/swagger`
	);
});
