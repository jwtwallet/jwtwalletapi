import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  providers: [AuthService],
  imports: [UserModule],
  controllers: [AuthController]
})
export class AuthModule {}
