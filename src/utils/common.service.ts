import { MongoAbility } from "@casl/ability";
import {
  ClientSession,
  Connection,
  Document,
  FilterQuery,
  Model,
  Require_id,
  Types
} from "mongoose";

import { accessibleBy } from "@casl/mongoose";
import { InjectConnection } from "@nestjs/mongoose";

type AbilityTupleFromAbility<A extends MongoAbility> =
  A extends MongoAbility<infer AbilityTuple> ? AbilityTuple : never;

export type SortByObject = Record<string, 1 | -1>;

export abstract class CommonService<
  T extends Document,
  A extends MongoAbility
> {
  @InjectConnection() private readonly connection: Connection;
  constructor(readonly repository: Model<T>) {}

  getSession() {
    return this.connection.startSession();
  }

  findOne(
    id: Types.ObjectId,
    session?: ClientSession
  ): Promise<Require_id<T> | null> {
    if (session) {
      return this.repository.findById(id).session(session).exec();
    }
    return this.repository.findById(id).exec();
  }

  findIn(ids: Types.ObjectId[], ability?: A): Promise<Require_id<T>[]> {
    return this.repository
      .find({
        $and: [
          {
            _id: {
              $in: ids
            }
          },
          ability !== undefined
            ? // @ts-expect-error - TS doesn't understand this.repository.modelName
              accessibleBy(ability, "read").ofType(this.repository.modelName)
            : {}
        ]
      })
      .exec();
  }

  findAll(
    ability?: A,
    filter?: FilterQuery<T>,
    limitDocuments: number | null = 10,
    skipDocuments: number | null = 0,
    action?: AbilityTupleFromAbility<A>[0],
    sortBy: SortByObject | null = { _id: -1 }
  ) {
    const query = (() => {
      return this.repository.find({
        $and: [
          filter || {},
          ability !== undefined
            ? // @ts-expect-error - TS doesn't understand this.repository.modelName
              accessibleBy(ability, action).ofType(this.repository.modelName)
            : {}
        ]
      });
    })().sort(sortBy);

    if (limitDocuments !== null && skipDocuments === null) {
      return query.limit(limitDocuments);
    }

    if (skipDocuments !== null && limitDocuments === null) {
      return query.skip(skipDocuments);
    }

    if (limitDocuments !== null && skipDocuments !== null) {
      return query.limit(limitDocuments).skip(skipDocuments);
    }

    return query;
  }

  save(document: T, session?: ClientSession) {
    return document.save({ session });
  }

  remove(id: Types.ObjectId) {
    return this.repository.findByIdAndDelete(id).exec();
  }
}
