import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { JWTPayload } from "jose";
import { JWTWalletService } from "jwtwallet-nestjs";
import { Types } from "mongoose";
import { UserService } from "../user/user.service";
import { AuthUserNotFound } from "./errors/authUserNotFound.error";
import { JwtVerificationError } from "./errors/jwtVerification.error";
import { MissingTokenError } from "./errors/missingToken.error";

export const IS_PUBLIC_KEY = "isPublic";

@Injectable()
export class AuthGuard implements CanActivate {
  logger = new Logger(AuthGuard.name);
  constructor(
    private reflector: Reflector,
    private jwtWallet: JWTWalletService,
    private userService: UserService
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true;
    }

    const token = this.extractToken(request);

    if (token === null) {
      throw new MissingTokenError();
    }

    let payload: JWTPayload;

    try {
      payload = await this.jwtWallet.verifyToken(token, "login");
    } catch (error) {
      this.logger.error(error);
      throw new JwtVerificationError();
    }

    if (!payload.sub) {
      throw new JwtVerificationError();
    }

    const userId = new Types.ObjectId(payload.sub);

    const user = await this.userService.findWithId(userId);

    if (user === null) {
      throw new AuthUserNotFound();
    }

    request.user = user;

    return true;
  }

  extractToken(request: Request) {
    const header = request.headers["authorization"];

    if (header !== undefined) {
      const authHeaderComponents = header.split(" ");
      if (authHeaderComponents.length !== 2) {
        return null;
      }

      const [scheme, token] = authHeaderComponents;
      if (scheme !== "Bearer") {
        return null;
      }

      return token;
    }

    // Try the query string

    const token = request.query["token"];

    if (token !== undefined && typeof token === "string") {
      return token;
    }

    return null;
  }
}

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
