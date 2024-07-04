import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class TokenResponse {
  @IsString()
  @Expose()
  accessToken: string;
}
