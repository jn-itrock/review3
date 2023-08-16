import { Injectable } from "@nestjs/common";
import { EventRepository } from "./event.repository";
import { Event } from "./schema/event.schema";
import { Document, FilterQuery } from "mongoose";
import { Types } from "mongoose";
import { Review } from "../review/schema/review.schema";
import { FileService } from "../file/file.service";

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly fileUploadService: FileService
  ) {}

  async create(
    data: Partial<Event>,
    file: Express.Multer.File
  ): Promise<Document<Event>> {
    if (file)
      data.image = await this.fileUploadService.uploadPublicFile(
        "review3",
        file.buffer,
        file.originalname,
        file.mimetype
      );
    return await this.eventRepository.createEntity(data);
  }

  async find(page: number = 1, limit: number = 5): Promise<Event[]> {
    return await this.eventRepository.find({}, page, limit, {
      totalStarts: -1,
    });
  }

  async findOne(filter: FilterQuery<Event>): Promise<Event> {
    return await this.eventRepository.findOne(filter);
  }

  async findById(_id: Types.ObjectId): Promise<Event> {
    return await this.findOne({ _id });
  }

  async update(
    filter: FilterQuery<Event>,
    data: Partial<Event>
  ): Promise<Event> {
    return await this.eventRepository.updateEntityOrFail(filter, data);
  }

  async updateById(_id: Types.ObjectId, data: Partial<Event>): Promise<Event> {
    return await this.update({ _id }, data);
  }

  async addReview(_id: Types.ObjectId, data: Partial<Review>): Promise<Event> {
    return await this.eventRepository.addReview(_id, data);
  }
}
