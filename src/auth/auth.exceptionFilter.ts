import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthBaseError } from "./errors/authBase.error";

@Catch(AuthBaseError)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: AuthBaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message;
    const errorCode = exception.code;

    response.status(403).json({
      errorCode: errorCode,
      message: message,
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
