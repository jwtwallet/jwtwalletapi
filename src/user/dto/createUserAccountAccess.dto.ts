import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate } from "class-validator";
import { Types } from "mongoose";
import { ObjectIdTransform } from "../../utils/objectId.transform";

export class CreateAccountAccessDto {
  @ApiProperty({
    type: String,
    description: "Account ID to filter",
    required: true
  })
  @Transform(ObjectIdTransform())
  accountId: Types.ObjectId;

  @ApiProperty({
    type: Date,
    description: "Expiration date for access",
    required: false
  })
  @Type(() => Date)
  @IsDate()
  dateExp?: Date;
}
