import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "../user/user.module";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { Account, AccountSchema } from "./model/account.model";

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema
      }
    ])
  ],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController]
})
export class AccountModule {}
