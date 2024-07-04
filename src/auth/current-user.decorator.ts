import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

import { User } from "../user/model/user.model";

export const CurrentUser = createParamDecorator<User>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  }
);
