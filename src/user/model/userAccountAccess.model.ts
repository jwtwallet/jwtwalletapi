/*
{
      _id: ObjectId, // Mongo ID for the association
      accountId: ObjectId, // Reference to the Account document
      access: 'read' | 'write', // Access level
      dateExp: Date? // Optional expiration date for access
    }
    
*/

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose, Type } from "class-transformer";
import { IsEnum } from "class-validator";
import { Schema as MongoSchema, Types } from "mongoose";
import { UserAccessLevel } from "../userAccessLevel.enum";

@Schema()
export class UserAccountAccess {
  @Expose()
  @Prop({ type: MongoSchema.Types.ObjectId, ref: "account", required: true })
  accountId: Types.ObjectId;

  @Expose()
  @IsEnum(UserAccessLevel)
  @Prop({ type: String, enum: UserAccessLevel, required: true })
  access: UserAccessLevel;

  @Expose()
  @Type(() => Date)
  @Prop({ type: Date, required: false })
  dateExp?: Date;
}

export const UserAccountAccessSchema =
  SchemaFactory.createForClass(UserAccountAccess);
