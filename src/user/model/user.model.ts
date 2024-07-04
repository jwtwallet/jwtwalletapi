import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude, Expose, Type } from "class-transformer";
import { HydratedDocument, Types } from "mongoose";
import {
  UserAccountAccess,
  UserAccountAccessSchema
} from "./userAccountAccess.model";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Exclude()
  kind: "User" = "User" as const;

  @Expose()
  get id(): string | undefined {
    if ("_id" in this && this._id instanceof Types.ObjectId)
      return this._id.toHexString();
  }

  @Prop({
    required: true,
    index: true,
    unique: true
  })
  @Expose()
  email: string;

  @Prop()
  password: string;

  @Expose()
  @Type(() => UserAccountAccess)
  @Prop({ type: [UserAccountAccessSchema], required: true, default: [] })
  accounts: UserAccountAccess[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
