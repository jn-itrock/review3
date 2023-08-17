import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { Document, Types } from "mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import { EventService } from "./event.service";
import { Event } from "./schema/event.schema";
import { CreateEventDto } from "./dto/create.dto";
import { PaginateDto } from "../../shared/dto/paginate.dto";
import { UpdateEventDto } from "./dto/update.dto";
import { ValidateMongoId } from "../../shared/pipes/validateMongoId.pipe";

@Controller("event")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async create(
    @Body() data: CreateEventDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Document<Event>> {
    return await this.eventService.create(data, file);
  }

  @Get()
  async find(@Query() paginateDto: PaginateDto): Promise<Event[]> {
    const { page, limit } = paginateDto;
    return await this.eventService.find(page, limit);
  }

  @Get("event2/:_id")
  async findById(@Param("_id", ValidateMongoId) _id: string): Promise<Event> {
    return await this.eventService.findById(new Types.ObjectId(_id));
  }

  @Patch(":_id")
  async updateById(
    @Param("_id", ValidateMongoId) _id: string,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<Event> {
    return await this.eventService.updateById(
      new Types.ObjectId(_id),
      updateEventDto
    );
  }
}
