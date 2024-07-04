import { AuthBaseError } from "./authBase.error";

export class AuthUserNotFound extends AuthBaseError {
  constructor() {
    super("User not found", 404);
  }
}
