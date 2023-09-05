export const envConfig = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,

  FORGOT_PASSWORD_LINK: process.env.FORGOT_PASSWORD_LINK,

  DB_URL: process.env.DB_URL,
  USERS_DB_URL: process.env.DB_URL,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASS: process.env.REDIS_PASS,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,

  SWAGGER_TITLE: process.env.SWAGGER_TITLE,
  SWAGGER_DESCRIPTION: process.env.SWAGGER_DESCRIPTION,
  SWAGGER_PATH: process.env.SWAGGER_PATH,
  SWAGGER_VERSION: process.env.SWAGGER_VERSION,

  GLOBAL_PREFIX: process.env.GLOBAL_PREFIX,
};
