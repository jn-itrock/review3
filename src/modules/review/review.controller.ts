import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { Review } from "./schema/review.schema";
import { Types } from "mongoose";
import { CreateReviewDto } from "./dto/create.dto";
import { ValidateMongoId } from "../../shared/pipes/validateMongoId.pipe";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(":eventId/:reviewId")
  async findById(
    @Param("eventId", ValidateMongoId) eventId: string,
    @Param("reviewId", ValidateMongoId) reviewId: string
  ): Promise<Review> {
    return await this.reviewService.findById(
      new Types.ObjectId(eventId),
      new Types.ObjectId(reviewId)
    );
  }

  @Post(":eventId")
  async create(
    @Param("eventId", ValidateMongoId) eventId: string,
    @Body() createReviewDto: CreateReviewDto
  ): Promise<Review> {
    return await this.reviewService.create(
      new Types.ObjectId(eventId),
      createReviewDto
    );
  }
}
