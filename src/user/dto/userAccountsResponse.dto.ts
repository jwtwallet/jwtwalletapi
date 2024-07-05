import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { UserAccountAccess } from "../model/userAccountAccess.model";

export class UserAccountsReponseDto {
  @ApiProperty({
    type: UserAccountAccess,
    description: "List of user accounts",
    isArray: true
  })
  @Expose()
  @Type(() => UserAccountAccess)
  accounts: UserAccountAccess[];

  constructor(accounts: UserAccountAccess[]) {
    this.accounts = accounts;
  }
}
