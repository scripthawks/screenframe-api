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
