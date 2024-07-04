import {
  AbilityBuilder,
  MongoAbility,
  createMongoAbility
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserDocument } from "../user/model/user.model";
import { UserService } from "../user/user.service";
import { UserAccessLevel } from "../user/userAccessLevel.enum";
import { CommonService } from "../utils/common.service";
import { AccountStatus } from "./accountStatus.enum";
import { Account, AccountDocument } from "./model/account.model";

export type AccountAbilitiesType = MongoAbility<
  ["manage" | "read" | "update" | "create", AccountDocument | "Account"]
>;

@Injectable()
export class AccountService extends CommonService<
  AccountDocument,
  AccountAbilitiesType
> {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,

    private userService: UserService
  ) {
    super(accountModel);
  }

  abilities(user: UserDocument) {
    const { can, build } = new AbilityBuilder<AccountAbilitiesType>(
      createMongoAbility
    );

    user.accounts.forEach((account) => {
      can("read", "Account", {
        _id: account.accountId
      });
    });

    can("create", "Account", {
      status: AccountStatus.Created
    });

    return build();
  }

  findWithId(id: Types.ObjectId): Promise<AccountDocument | null> {
    return this.accountModel.findById(id).exec();
  }

  addUserToAccount(
    account: AccountDocument,
    user: UserDocument,
    role: UserAccessLevel
  ) {
    return this.userService.addAccountAsCreator(user, account._id, role);
  }

  create(account: Account): AccountDocument {
    return new this.accountModel(account);
  }
}
