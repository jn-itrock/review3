import { IsNotEmpty, IsString } from "class-validator";

export class UpdateEventDto {
  @IsNotEmpty()
  @IsString()
  lensId: string;
}
