import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { User } from "../model/user.model";

export class PagedUserResponseDto {
  @ApiProperty({
    type: User,
    description: "List of users",
    isArray: true
  })
  @Expose()
  @Type(() => User)
  result: User[];

  @ApiProperty({
    type: Number,
    description: "Page number",
    required: true,
    example: 0
  })
  @Expose()
  page: number;

  @ApiProperty({
    type: Number,
    description: "Number of items",
    required: true,
    example: 10
  })
  @Expose()
  count: number;

  constructor(users: User[], page: number, count: number) {
    this.result = users;
    this.page = page;
    this.count = count;
  }
}
