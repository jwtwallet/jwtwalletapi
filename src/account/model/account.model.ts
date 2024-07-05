import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested
} from "class-validator";
import { HydratedDocument, Types } from "mongoose";
import { AccountStatus } from "../accountStatus.enum";
import { PublicKey } from "./publicKey.model";

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Exclude()
  @IsString()
  kind: "Account" = "Account" as const;

  @Expose()
  get id(): string | undefined {
    if ("_id" in this && this._id instanceof Types.ObjectId)
      return this._id.toHexString();
  }

  @Expose()
  @Prop({
    required: true,
    index: true,
    unique: true,
    type: PublicKey
  })
  @Type(() => PublicKey)
  @ValidateNested()
  @IsObject()
  publicKey: PublicKey;

  @Expose()
  @Prop({
    required: true,
    index: true,
    unique: true,
    type: [PublicKey]
  })
  @IsArray()
  @Type(() => PublicKey)
  @ValidateNested()
  publicKeys: PublicKey[];

  @Expose()
  @Prop({
    required: true,
    index: true,
    type: String
  })
  @IsString()
  keyHash: string;

  @Expose()
  @Prop({
    required: true,
    type: Number
  })
  @IsNumber()
  @Min(0)
  revision: number;

  @Expose()
  @Prop({
    required: true,
    type: String,
    enum: AccountStatus
  })
  @IsEnum(AccountStatus)
  status: AccountStatus;

  @Expose()
  @Prop({
    required: true,
    type: Date
  })
  @IsDate()
  @Type(() => Date)
  deploymentDate: Date;

  @Expose()
  @Prop({
    required: true,
    type: Date
  })
  @IsDate()
  @Type(() => Date)
  expirationDate: Date;

  @Prop({
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  signature?: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
