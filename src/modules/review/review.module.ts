import { Module } from "@nestjs/common";
import { ReviewController } from "./review.controller";
import { EventModule } from "../event/event.module";
import { ReviewService } from "./review.service";

@Module({
  imports: [EventModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
