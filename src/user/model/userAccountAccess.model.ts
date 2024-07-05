/*
{
      _id: ObjectId, // Mongo ID for the association
      accountId: ObjectId, // Reference to the Account document
      access: 'read' | 'write', // Access level
      dateExp: Date? // Optional expiration date for access
    }
    
*/

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsObject,
  IsOptional,
  IsString
} from "class-validator";
import { Schema as MongoSchema, Types } from "mongoose";
import { ObjectIdTransform } from "../../utils/objectId.transform";
import { UserAccessLevel } from "../userAccessLevel.enum";

@Schema({ timestamps: true })
export class UserAccountAccess {
  @ApiHideProperty()
  @Exclude()
  @IsString()
  kind: "UserAccountAccess" = "UserAccountAccess" as const;

  @ApiProperty({
    type: String,
    description: "Account ID the user has access to",
    required: true,
    example: "6686f62c70ffe03970500eb7"
  })
  @Expose()
  @IsObject()
  @Transform(ObjectIdTransform())
  @Prop({ type: MongoSchema.Types.ObjectId, ref: "account", required: true })
  accountId: Types.ObjectId;

  @Exclude()
  @Transform(ObjectIdTransform())
  @Prop({ type: MongoSchema.Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @ApiProperty({
    type: String,
    enum: UserAccessLevel,
    description: "Access level",
    required: true,
    example: UserAccessLevel.Write
  })
  @Expose()
  @IsEnum(UserAccessLevel)
  @Prop({ type: String, enum: UserAccessLevel, required: true })
  access: UserAccessLevel;

  @ApiProperty({
    type: Date,
    description: "Expiration date for access",
    required: false
  })
  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Prop({ type: Date, required: false })
  dateExp?: Date;

  @ApiProperty({
    type: Boolean,
    description: "Is this an invite?",
    required: false
  })
  @IsBoolean()
  @Expose()
  @Prop({ type: Boolean, required: true, default: true })
  invite: boolean;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}

export const UserAccountAccessSchema =
  SchemaFactory.createForClass(UserAccountAccess);
