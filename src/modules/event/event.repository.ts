import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base/base.repository";
import { Event, EventDocument } from "./schema/event.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "../../shared/db/plugins/softDelete.interface";
import { Types } from "mongoose";
import { Review } from "../review/schema/review.schema";
import { EntityNotFound } from "../../shared/exceptions/exceptions";

@Injectable()
export class EventRepository extends BaseRepository<EventDocument> {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>
  ) {
    super(eventModel);
  }

  async addReview(_id: Types.ObjectId, data: Partial<Review>): Promise<Event> {
    data._id = new Types.ObjectId();
    data.date = new Date();
    const event = await this.eventModel
      .findByIdAndUpdate(
        _id,
        {
          $push: {
            reviews: {
              $each: [data],
              $position: 0,
            },
          },
          $inc: { totalReviews: 1, totalStarts: data.stars },
        },
        { new: true }
      )
      .exec();

    if (!event) throw new EntityNotFound(this.eventModel.modelName);

    return event;
  }
}
