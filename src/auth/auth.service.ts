import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JWTWalletService } from "jwtwallet-nestjs";
import * as moment from "moment";
import { Require_id } from "mongoose";
import { User } from "../user/model/user.model";
import { UserService } from "../user/user.service";
@Injectable()
export class AuthService {
  constructor(
    private jwtWalletService: JWTWalletService,
    private userService: UserService
  ) {}

  async checkPassword(user: User, password: string) {
    return bcrypt.compare(password, user.password);
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return false;
    }

    if ((await this.checkPassword(user, password)) === false) {
      return false;
    }

    const token = this.createToken(user);

    return token;
  }

  async register(email: string, password: string) {
    const userExists = await this.userService.findByEmail(email);

    if (userExists) {
      return false;
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = new User();

    newUser.email = email;
    newUser.password = hashedPassword;

    const user = await this.userService.create(newUser);

    const token = this.createToken(user);

    return token;
  }

  createToken(user: Require_id<User>) {
    const token = this.jwtWalletService.signToken(
      {
        aud: "login",
        sub: user._id.toHexString()
      },
      // expires on
      moment().add(10, "days").unix()
    );

    return token;
  }
}
