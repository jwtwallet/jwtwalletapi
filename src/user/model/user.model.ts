import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose } from "class-transformer";
import { HydratedDocument, Types } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
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
}

export const UserSchema = SchemaFactory.createForClass(User);
