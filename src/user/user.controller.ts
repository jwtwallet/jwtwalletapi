import { Controller, Get } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { UserDocument } from "./model/user.model";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll(@CurrentUser() user: UserDocument) {
    const abilities = this.userService.abilities(user);

    return this.userService.findAll(abilities);
  }
}
