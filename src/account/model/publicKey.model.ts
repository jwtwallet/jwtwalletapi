import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEnum, IsString, IsUUID } from "class-validator";
import {
  PublicKeyAlgorithm,
  PublicKeyCurve,
  PublicKeyType,
  PublicKeyUse
} from "../publicKey.enum";

@Schema()
export class PublicKey {
  @IsEnum(PublicKeyType)
  @Prop({ required: true, enum: PublicKeyType })
  kty: PublicKeyType;

  @IsEnum(PublicKeyAlgorithm)
  @Prop({ required: true, enum: PublicKeyAlgorithm })
  alg: PublicKeyAlgorithm;

  @IsEnum(PublicKeyUse)
  @Prop({ required: true, enum: PublicKeyUse })
  use: PublicKeyUse;

  @IsUUID()
  @Prop({ required: true })
  kid: string;

  @IsEnum(PublicKeyCurve)
  @Prop({ required: true, enum: PublicKeyCurve })
  crv: PublicKeyCurve;

  @Prop({ required: true })
  @IsString()
  x: string;

  @Prop({ required: true })
  @IsString()
  y: string;
}

export const PublicKeySchema = SchemaFactory.createForClass(PublicKey);
