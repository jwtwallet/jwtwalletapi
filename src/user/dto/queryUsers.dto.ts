import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";
import { FilterQuery, Types } from "mongoose";
import { MAX_LIMIT_ALLOWED, MIN_LIMIT_ALLOWED } from "../../constants";
import { ObjectIdTransform } from "../../utils/objectId.transform";
import { UserDocument } from "../model/user.model";

export class QueryUsersDto {
  @ApiProperty({
    type: Number,
    description: "Number of items to retrieve",
    required: false,
    default: 10
  })
  @Type(() => Number)
  @IsNumber()
  @Min(MIN_LIMIT_ALLOWED)
  @Max(MAX_LIMIT_ALLOWED)
  limit: number = 10;

  @ApiProperty({
    type: Number,
    description: "Page number to retrieve",
    required: false,
    default: 0
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page: number = 0;

  @ApiProperty({
    type: String,
    description: "Account ID to filter",
    required: false
  })
  @IsOptional()
  @Transform(ObjectIdTransform())
  accountId?: Types.ObjectId;

  convertToQuery(): FilterQuery<UserDocument> {
    return {
      $and: [this.accountId ? { "accounts.accountId": this.accountId } : {}]
    };
  }
}
