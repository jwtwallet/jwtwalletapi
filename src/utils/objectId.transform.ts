import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { TransformFnParams, TransformationType } from "class-transformer";
import { Types } from "mongoose";

// export type ObjectIdTransformSettings = {};

@Injectable()
export class ParseObjectIdPipe
  implements PipeTransform<string, Types.ObjectId>
{
  transform(value: string): Types.ObjectId {
    const validObjectId = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      throw new BadRequestException("Invalid ObjectId");
    }

    return new Types.ObjectId(value);
  }
}

export const ObjectIdTransform = () => (params: TransformFnParams) => {
  // console.log(params);
  if (params.type == TransformationType.CLASS_TO_PLAIN) {
    if (params.value instanceof Types.ObjectId) {
      return params.value.toHexString();
    }
    return;
  }

  if (params.type == TransformationType.PLAIN_TO_CLASS) {
    if (typeof params.value == "string") {
      if (Types.ObjectId.isValid(params.value)) {
        return new Types.ObjectId(params.value);
      }
      throw new Error("Invalid ObjectId");
    }
    return;
  }
};
