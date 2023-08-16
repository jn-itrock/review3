import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Event, eventSchema } from "./schema/event.schema";
import { EventRepository } from "./event.repository";
import { FileModule } from "../file/file.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: eventSchema }]),
    FileModule,
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository],
  exports: [EventService],
})
export class EventModule {}
