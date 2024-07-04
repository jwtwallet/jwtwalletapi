import {
  AbilityBuilder,
  MongoAbility,
  createMongoAbility
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CommonService } from "../utils/common.service";
import { User, UserDocument } from "./model/user.model";
import { UserAccountAccess } from "./model/userAccountAccess.model";
import { UserAccessLevel } from "./userAccessLevel.enum";

export type UserAbilitiesType = MongoAbility<
  [
    (
      | "manage"
      | "read"
      | "update"
      | "create"
      | "delete"
      | "invite"
      | "accept"
      | "reject"
    ),
    UserDocument | "User" | UserAccountAccess | "UserAccountAccess"
  ]
>;

@Injectable()
export class UserService extends CommonService<
  UserDocument,
  UserAbilitiesType
> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  abilities(user: UserDocument) {
    const { can, build } = new AbilityBuilder<UserAbilitiesType>(
      createMongoAbility
    );

    can("read", "User", {
      _id: user._id
    });

    can("update", "User", {
      _id: user._id
    });

    // Can read the users within the same account

    can("read", "User", {
      accounts: {
        $elemMatch: {
          userId: user._id
        }
      }
    });

    can("read", "UserAccountAccess", {
      userId: user._id
    });

    user.accounts.forEach((account) => {
      if (account.invite) {
        can("accept", "UserAccountAccess", {
          accountId: account.accountId,
          userId: user._id
        });
        can("delete", "UserAccountAccess", {
          accountId: account.accountId,
          userId: user._id
        });
        return;
      }

      can("read", "User", {
        accounts: {
          $elemMatch: {
            accountId: account.accountId
          }
        }
      });

      if (account.access === UserAccessLevel.Write) {
        can("read", "UserAccountAccess", {
          accountId: account.accountId
        });
        can("update", "UserAccountAccess", {
          accountId: account.accountId
        });
        can("create", "UserAccountAccess", {
          accountId: account.accountId,
          invite: true
        });
        can("delete", "UserAccountAccess", {
          accountId: account.accountId
        });
      }
    });

    return build();
  }

  findWithId(id: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        email: { $eq: email }
      })
      .exec();
  }

  addAccountAsCreator(
    user: UserDocument,
    accountId: Types.ObjectId,
    level: UserAccessLevel
  ) {
    const newAccountAccess = new UserAccountAccess();
    newAccountAccess.accountId = accountId;
    newAccountAccess.access = level;
    newAccountAccess.invite = false;
    newAccountAccess.userId = user._id;

    user.accounts.push(newAccountAccess);

    return user.save();
  }
  create(user: User): Promise<UserDocument> {
    return this.userModel.create(user);
  }
}
