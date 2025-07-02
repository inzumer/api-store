/** Dotenv */
import * as dotenv from 'dotenv';
dotenv.config();

export const APP_IDS = {
  WEB_MOBILE: process.env.WEB_MOBILE_APP_ID,
  WEB_DESKTOP: process.env.WEB_DESKTOP_APP_ID,
  ANDROID: process.env.ANDROID_APP_ID,
  IOS: process.env.IOS_APP_ID,
  TABLET: process.env.TABLET_APP_ID,
  DESKTOP: process.env.DESKTOP_APP_ID,
  SWAGGER: process.env.SWAGGER_APP_ID,
};
