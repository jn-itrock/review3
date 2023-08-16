import { MongooseModule } from "@nestjs/mongoose";
import { softDeletePlugin } from "../shared/db/plugins/softDelete.plugin";

export default MongooseModule.forRoot(process.env.DATABASE_URI, {
  connectionFactory: (connection) => {
    connection.plugin(softDeletePlugin);
    return connection;
  },
});
