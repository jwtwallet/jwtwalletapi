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
import { UserAccessLevel } from "./userAccessLevel.enum";

export type UserAbilitiesType = MongoAbility<
  ["manage" | "read" | "update", UserDocument | "User"]
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

    user.accounts.forEach((account) => {
      can("read", "User", {
        accounts: {
          $elemMatch: {
            accountId: account.accountId
          }
        }
      });
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

  addAccount(
    user: UserDocument,
    accountId: Types.ObjectId,
    level: UserAccessLevel
  ) {
    user.accounts.push({
      accountId,
      access: level
    });

    return user.save();
  }
  create(user: User): Promise<UserDocument> {
    return this.userModel.create(user);
  }
}
