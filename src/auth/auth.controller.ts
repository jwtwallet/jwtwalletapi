import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Post,
  SerializeOptions,
  UseInterceptors
} from "@nestjs/common";
import { Require_id } from "mongoose";
import { User } from "../user/model/user.model";
import { Public } from "./auth.guard";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./current-user.decorator";
import { LoginPasswordDto } from "./dto/loginPassword.dto";
import { MeResponseDto } from "./dto/meResponse.dto";
import { RegisterUserDto } from "./dto/registerUser.dto";
import { TokenResponse } from "./dto/tokenResponse.dto";

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
export class AuthController {
  constructor(private authService: AuthService) {}

  logger = new Logger(AuthController.name);

  @Public()
  @Post("login")
  async login(@Body() body: LoginPasswordDto) {
    const token = await this.authService.login(body.email, body.password);

    if (!token) {
      return "login failed";
    }

    const tokenResponse = new TokenResponse();

    tokenResponse.accessToken = token;

    return tokenResponse;
  }

  @Public()
  @Post("register")
  async register(@Body() body: RegisterUserDto) {
    const token = await this.authService.register(body.email, body.password);

    if (!token) {
      return "register failed";
    }

    const tokenResponse = new TokenResponse();

    tokenResponse.accessToken = token;

    return tokenResponse;
  }

  @Get("me")
  me(@CurrentUser() user: Require_id<User>) {
    const meResponse = new MeResponseDto();

    meResponse.user = user;

    return meResponse;
  }
}
