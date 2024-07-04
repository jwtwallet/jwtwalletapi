import { AuthBaseError } from "./authBase.error";

export class JwtVerificationError extends AuthBaseError {
  constructor() {
    super("JWT verification error", 401);
  }
}
