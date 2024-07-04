import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Require_id, Types } from "mongoose";
import { User } from "./model/user.model";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findWithId(id: Types.ObjectId): Promise<Require_id<User> | null> {
    return this.userModel.findById(id).exec();
  }

  findByEmail(email: string): Promise<Require_id<User> | null> {
    return this.userModel
      .findOne({
        email: { $eq: email }
      })
      .exec();
  }

  create(user: User): Promise<Require_id<User>> {
    return this.userModel.create(user);
  }
}
