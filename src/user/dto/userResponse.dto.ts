import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { User } from "../model/user.model";

export class UserResponseDto {
  @ApiProperty({
    type: User,
    description: "User object"
  })
  @Expose()
  @Type(() => User)
  result: User;

  constructor(user: User) {
    this.result = user;
  }
}
