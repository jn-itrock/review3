import { MongooseModule } from "@nestjs/mongoose";
import ConfigModule, { environments } from "./env.config";
import { softDeletePlugin } from "../shared/db/plugins/softDelete.plugin";
import { ConfigType } from "@nestjs/config";

export default MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [environments.KEY],
  useFactory: async (configService: ConfigType<typeof environments>) => {
    return {
      uri: configService.DATABASE_URI,
      connectionFactory: (connection) => {
        connection.plugin(softDeletePlugin);
        return connection;
      },
    };
  },
});
