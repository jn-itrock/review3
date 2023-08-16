import { Module } from "@nestjs/common";
import DatabaseModule from "../config/db.config";
import ConfigModule from "../config/env.config";
import { Modules } from "../modules/modules";

@Module({
  imports: [ConfigModule, DatabaseModule, Modules],
})
export class AppModule {}
