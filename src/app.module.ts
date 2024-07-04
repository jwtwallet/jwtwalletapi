import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { JWTWalletModule } from "jwtwallet-nestjs";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.local", ".env.default"],
      isGlobal: false,
      ignoreEnvVars: true
    }),
    JWTWalletModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get("JWT_PRIVATE"),
        issuer: configService.get("JWT_ISSUER"),
        devPublicKey: configService.get("JWT_MOCK_PUBLIC"),
        devPort: configService.get("PORT")
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("MONGO_URI")
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
