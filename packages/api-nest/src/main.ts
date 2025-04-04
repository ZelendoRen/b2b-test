import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import Bottleneck from "bottleneck";
import { Request, Response, NextFunction } from "express";
import config from "./config/config";
import { Logger } from "@nestjs/common";
async function bootstrap() {
	const logger = new Logger("API");
	const app = await NestFactory.create(AppModule);

	app.enableCors();
	app.useGlobalPipes(new ValidationPipe());
	const limiter = new Bottleneck({
		maxConcurrent: config.api.maxConcurrent,
		minTime: config.api.minTime,
	});
	app.use((req: Request, res: Response, next: NextFunction) => {
		limiter.schedule(() => Promise.resolve(next()));
	});

	const swaggerConfig = new DocumentBuilder()
		.setTitle("Token API")
		.setDescription("API for managing token operations")
		.setVersion("1.0")
		.addTag("token")
		.build();
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("swagger", app, document);
	logger.log(`API is running on port ${config.api.port}`);
	logger.log(
		`Swagger is running on http://localhost:${config.api.port}/swagger`
	);
	await app.listen(config.api.port);
}
bootstrap();
