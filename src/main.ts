import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.getOrThrow<number>("PORT");

  const swaggerConfig = new DocumentBuilder()
    .setTitle("JWR Wallet API")
    .setLicense(
      "GNU AGPLv3",
      "https://github.com/jwtwallet/jwtwalletapi/blob/main/LICENSE"
    )
    .addServer(`http://localhost:${port}`, "Local")
    .setDescription("The JWR Wallet API")
    .setVersion("1")
    .addBearerAuth()
    .build();

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "v",
    defaultVersion: "1"
  });
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("apidocs", app, document, {
    swaggerOptions: { persistAuthorization: true }
  });

  await app.listen(port);
}

void bootstrap();
