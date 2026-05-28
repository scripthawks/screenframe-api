export class CreateProfileDto {
  firstName: string;
  lastName: string;
  birthDate?: Date;
  country?: string;
  city?: string;
  about?: string;
  userName?: string;
}
