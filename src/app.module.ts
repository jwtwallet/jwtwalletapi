import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { JWTWalletModule } from "jwtwallet-nestjs";
import { AppService } from "./app.service";
import { AuthExceptionFilter } from "./auth/auth.exceptionFilter";
import { AuthGuard } from "./auth/auth.guard";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";

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
    }),
    AuthModule,
    UserModule
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter
    }
  ]
})
export class AppModule {}
