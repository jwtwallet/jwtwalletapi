import { Expose, Type } from "class-transformer";
import { User } from "../../user/model/user.model";

export class MeResponseDto {
  @Type(() => User)
  @Expose()
  user: User;
}
