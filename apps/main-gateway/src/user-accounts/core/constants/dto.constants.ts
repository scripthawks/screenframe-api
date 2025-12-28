export const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_MIN_LENGTH = 6;

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const PASSWORD_REGEX =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).*$/;
export const PASS_MAX_LENGTH = 20;
export const PASS_MIN_LENGTH = 6;

export const CONFIRMATION_TOKEN_LENGTH = 500;

export const UNVERIFIED_USER_EXPIRY_24_HOURS = 24 * 60 * 60 * 1000;

export const PASSWORD_RECOVERY_TOKEN_EXPIRY = 1000 * 60 * 60;
export const RECAPTCHA_MIN_SCORE = 0.7;
export const RECAPTCHA_TEST_SCORE = 0.99;

export const THROTTLER_AUTH_NAME = 'auth';
export const THROTTLER_AUTH_TTL = 10000;
export const THROTTLER_AUTH_LIMIT = 5;
