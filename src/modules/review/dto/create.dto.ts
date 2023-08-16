import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  stars: number;
}
