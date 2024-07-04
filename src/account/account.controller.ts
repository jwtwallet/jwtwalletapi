import { ForbiddenError } from "@casl/ability";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { UserDocument } from "../user/model/user.model";
import { UserAccessLevel } from "../user/userAccessLevel.enum";
import { AccountService } from "./account.service";
import { Account } from "./model/account.model";

@Controller("account")
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  findAll(@CurrentUser() user: UserDocument) {
    const abilities = this.accountService.abilities(user);

    return this.accountService.findAll(abilities);
  }

  @Post()
  async create(@CurrentUser() user: UserDocument, @Body() body: Account) {
    const abilities = this.accountService.abilities(user);

    const account = this.accountService.create(body);

    ForbiddenError.from(abilities).throwUnlessCan("create", account);

    await this.accountService.save(account);

    await this.accountService.addUserToAccount(
      account,
      user,
      UserAccessLevel.Write
    );

    return account;
  }
}
