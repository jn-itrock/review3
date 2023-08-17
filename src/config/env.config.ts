import { ConfigModule, registerAs } from "@nestjs/config";

export const environments = registerAs("config", () => {
  return {
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
    STORAGE_S3_BUCKET: process.env.STORAGE_S3_BUCKET,
    URL_IMAGES: process.env.URL_IMAGES,
  };
});

export default ConfigModule.forRoot({
  load: [environments],
  isGlobal: true,
});
