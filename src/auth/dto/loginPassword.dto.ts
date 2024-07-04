import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class LoginPasswordDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: "User email",
    required: true
  })
  @IsEmail()
  email: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: "User password",
    required: true
  })
  @IsString()
  password: string;
}
