import { Injectable } from "@nestjs/common";
import { EventService } from "../event/event.service";
import { Review } from "./schema/review.schema";
import { Types } from "mongoose";

@Injectable()
export class ReviewService {
  constructor(private readonly eventService: EventService) {}

  async findById(
    eventId: Types.ObjectId,
    reviewId: Types.ObjectId
  ): Promise<Review> {
    const event = await this.eventService.findOne({
      _id: eventId,
      "reviews._id": reviewId,
    });

    return event.reviews[0];
  }

  async create(
    eventId: Types.ObjectId,
    data: Partial<Review>
  ): Promise<Review> {
    const event = await this.eventService.addReview(eventId, data);
    return event.reviews[0];
  }
}
