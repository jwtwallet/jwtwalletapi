import { User } from "./user/model/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}