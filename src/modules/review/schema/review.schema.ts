import { Types } from "mongoose";

export class Review {
  _id: Types.ObjectId;

  readonly userId: string;

  date: Date;

  readonly description: string;

  readonly stars: number;
}
