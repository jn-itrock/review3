import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginateDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number;
}
