import { Module } from "@nestjs/common";
import { EventModule } from "./event/event.module";
import { ReviewModule } from "./review/review.module";

@Module({
  imports: [EventModule, ReviewModule],
})
export class Modules {}
