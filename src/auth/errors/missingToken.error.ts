import { AuthBaseError } from "./authBase.error";

export class MissingTokenError extends AuthBaseError {
  constructor() {
    super("Missing token", 401);
  }
}
