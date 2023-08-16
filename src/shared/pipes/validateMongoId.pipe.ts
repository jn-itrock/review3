import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class ValidateMongoId implements PipeTransform<string> {
  transform(value: string): string {
    if (Types.ObjectId.isValid(value)) {
      if (String(new Types.ObjectId(value)) === value) return value;
      throw new BadRequestException(
        "El ID enviado tiene que ser un MongoID Valido."
      );
    }
    throw new BadRequestException(
      "El ID enviado tiene que ser un MongoID Valido."
    );
  }
}
