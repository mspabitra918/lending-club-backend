import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  declare fullName: string;

  @IsEmail()
  declare email: string;

  @IsString()
  @Matches(/^[0-9+\-\s]{7,15}$/, { message: 'Invalid phone number' })
  declare phone: string;

  @IsString()
  @MinLength(6)
  declare password: string;
}
