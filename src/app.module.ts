import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.local", ".env.default"],
      isGlobal: false,
      ignoreEnvVars: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
