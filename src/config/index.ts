import * as dotenv from 'dotenv';
import * as joi from 'joi';

process.env.ENV_PATH
  ? dotenv.config({ path: process.env.ENV_PATH })
  : dotenv.config();

// validating environment variables
const envVarsSchema = joi
  .object({
    PORT: joi.number().default('5000'),
    NODE_ENV: joi
      .string()
      .allow(...['development', 'staging', 'production'])
      .required(),
    DEVELOPMENT_START_COMMAND: joi.string().default('npm run start:dev'),
    LOG_LEVEL: joi
      .string()
      .allow(...['error', 'warning', 'info', 'debug', 'silly', ''])
      .default('silly'),
    JWT_SECRET: joi.string().required(),
    FRONTEND_URL: joi.string().required(),
    GROUP_INVITE_URL: joi.string().required(),
    BOLD_METRICS_CLIENT_ID: joi.string().required(),
    BOLD_METRICS_USER_KEY: joi.string().required(),

    // database config
    MONGODB_URI: joi.string().required(),
    DATABASE_LOGGING: joi
      .boolean()
      .truthy('TRUE')
      .truthy('true')
      .falsy('FALSE')
      .falsy('false')
      .default(false),

    // emails
    SENDGRID_API_KEY: joi.string().required(),
    OUTFIT_BUYER_AFTER_FIRST_EVENT_EMAIL: joi.string().required(),
    RECIPIENT_INVITE_EMAIL_TEMPLATE: joi.string().required(),
    EXISTING_TAILOR_INVITE_EMAIL_TEMPLATE: joi.string().required(),
    UNREGISTERED_TAILOR_INVITE_EMAIL_TEMPLATE: joi.string().required(),
    RECIPIENT_INVITE_NEW_USER_EMAIL_TEMPLATE: joi.string().required(),
    SENDGRID_FROM_EMAIL: joi.string().required(),
    EARLIEST_EVENT_DATE_GAP: joi.number().required(),

    AT_KEY: joi.string().required(),
    AT_USERNAME: joi.string().required(),
    OTP_TTL: joi.number().required().default(600),
    PASSWORD_RECOVERY_TTL: joi.number().required().default(72),
    PASSWORD_RECOVERY_EMAIL: joi.string().required(),
    PASSWORD_RECOVERY_URL: joi.string().required(),
    TWILIO_ACCOUNT_SID: joi.string().required(),
    TWILIO_AUTH_TOKEN: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),
    CLOUDINARY_URL: joi.string().required(),
    CLOUDINARY_CLOUD_NAME: joi.string().required(),
    PUSHER_SECRET_KEY: joi.string().required(),
    PUSHER_INSTANCE_ID: joi.string().required(),
    ACCOUNT_VERIFICATION_TTL: joi.number().required().default(7),
    ACCOUNT_VERIFICATION_EMAIL_TEMPLATE: joi.string().required(),
    ACCOUNT_VERIFICATION_URL: joi.string().required(),
    EXISTING_USER_CREATE_EVENT_EMAIL_TEMPLATE: joi.string().required(),
    TAILOR_SIGNUP_EMAIL_PASSWORD_ID: joi.string().required(),
    TAILOR_SIGNUP_EMAIL_NO_PASSWORD_ID: joi.string().required(),
    TAILOR_RESET_PASSWORD: joi.string().required(),
    TAILOR_SIGN_UP: joi.string().required(),
    TAILOR_INVITE: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error}`);
}

export const config = {
  env: envVars.NODE_ENV,
  url: envVars.APP_URL,
  port: envVars.PORT,
  logLevel: envVars.LOG_LEVEL,
  secret: envVars.JWT_SECRET,
  feBaseUrl: envVars.FE_BASE_URL,
  accountVerificationTtl: envVars.ACCOUNT_VERIFICATION_TTL,
  accountVerificationUrl: envVars.ACCOUNT_VERIFICATION_URL,
  db: {
    uri: envVars.MONGODB_URI,
    name: `${envVars.PGDATABASE}${envVars.NODE_ENV === 'test' ? '-test' : ''}`,
    logging: envVars.DATABASE_LOGGING,
  },
  sendGrid: {
    apiKey: envVars.SENDGRID_API_KEY,
    welcomeEmailTemplate: envVars.SENDGRID_WELCOME_EMAIL_TEMPLATE,
    resetPasswordTemplate: envVars.SENDGRID_RESET_PASSWORD_TEMPLATE,
    inviteEmailTemplate: envVars.SENDGRID_INVITE_EMAIL_TEMPLATE,
    outfitBuyerFirstEventEmail: envVars.OUTFIT_BUYER_AFTER_FIRST_EVENT_EMAIL,
    recipientInviteEmail: envVars.RECIPIENT_INVITE_EMAIL_TEMPLATE,
    existingTailorInviteEmail: envVars.EXISTING_TAILOR_INVITE_EMAIL_TEMPLATE,
    newUserRecipientInviteEmail:
      envVars.RECIPIENT_INVITE_NEW_USER_EMAIL_TEMPLATE,
    unregisteredTailorInviteEmail:
      envVars.UNREGISTERED_TAILOR_INVITE_EMAIL_TEMPLATE,
    fromEmail: envVars.SENDGRID_FROM_EMAIL,
    passwordRecoveryEmail: envVars.PASSWORD_RECOVERY_EMAIL,
    memberSignUpEmail: envVars.MEMBER_SIGNUP,
    accountVerificationEmail: envVars.ACCOUNT_VERIFICATION_EMAIL_TEMPLATE,
    existingUserCreateEventEmail:
      envVars.EXISTING_USER_CREATE_EVENT_EMAIL_TEMPLATE,
    TAILOR_SIGNUP_EMAIL_PASSWORD_ID: envVars.TAILOR_SIGNUP_EMAIL_PASSWORD_ID,
    TAILOR_SIGNUP_EMAIL_NO_PASSWORD_ID:
      envVars.TAILOR_SIGNUP_EMAIL_NO_PASSWORD_ID,
    TAILOR_RESET_PASSWORD: envVars.TAILOR_RESET_PASSWORD,
    TAILOR_SIGN_UP: envVars.TAILOR_SIGN_UP,
    TAILOR_INVITE: envVars.TAILOR_INVITE,
    TAILOR_LINK: envVars.TAILOR_LINK,
  },
  twilio: {
    accountSid: envVars.TWILIO_ACCOUNT_SID,
    authToken: envVars.TWILIO_AUTH_TOKEN,
  },
  africasTalking: {
    apiKey: envVars.AT_KEY,
    username: envVars.AT_USERNAME,
  },
  otpTtl: envVars.OTP_TTL,
  passwordRecoveryTtl: envVars.PASSWORD_RECOVERY_TTL,
  passwordRecoveryUrl: envVars.PASSWORD_RECOVERY_URL,
  frontendUrl: envVars.FRONTEND_URL,
  groupInviteUrl: envVars.GROUP_INVITE_URL,
  boldMetrics: {
    clientId: envVars.BOLD_METRICS_CLIENT_ID,
    userKey: envVars.BOLD_METRICS_USER_KEY,
  },
  isDevelopment:
    envVars.NODE_ENV === 'test' || envVars.NODE_ENV === 'development',
  minEventStartDate: envVars.EARLIEST_EVENT_DATE_GAP,

  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
    url: envVars.CLOUDINARY_URL,
  },
  pusher: {
    secretKey: envVars.PUSHER_SECRET_KEY,
    instanceId: envVars.PUSHER_INSTANCE_ID,
  },
};
