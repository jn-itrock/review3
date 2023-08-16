import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Review } from "../../review/schema/review.schema";

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  readonly _id: Types.ObjectId;

  @Prop({ type: String, required: false, default: null })
  readonly lensId: string;

  @Prop({ type: String, required: true })
  readonly title: string;

  @Prop({ type: String, required: true })
  readonly description: string;

  @Prop({ type: String, required: false, default: null })
  image: string;

  @Prop({ type: Number, required: false, default: 0 })
  readonly totalReviews: number;

  @Prop({ type: () => [Review], required: false, default: [] })
  readonly reviews: Review[];

  @Prop({ type: Number, required: false, default: 0 })
  readonly totalStarts: number;
}

export const eventSchema = SchemaFactory.createForClass(Event);
