import { NestFactory } from "@nestjs/core";
import "multer";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "./shared/filters/filter.exception";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
