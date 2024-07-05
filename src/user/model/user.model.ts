import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { HydratedDocument, Types } from "mongoose";
import {
  UserAccountAccess,
  UserAccountAccessSchema
} from "./userAccountAccess.model";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @ApiHideProperty()
  @Exclude()
  kind: "User" = "User" as const;

  @ApiProperty({
    type: String,
    description: "User ID",
    required: false
  })
  @Expose()
  get id(): string | undefined {
    if ("_id" in this && this._id instanceof Types.ObjectId)
      return this._id.toHexString();
  }

  @ApiProperty({
    type: String,
    description: "User email",
    required: true
  })
  @Prop({
    required: true,
    index: true,
    unique: true
  })
  @Expose()
  email: string;

  @ApiHideProperty()
  @Prop()
  password: string;

  @ApiHideProperty()
  @Exclude()
  @Type(() => UserAccountAccess)
  @Prop({ type: [UserAccountAccessSchema], required: true, default: [] })
  accounts: UserAccountAccess[];

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
