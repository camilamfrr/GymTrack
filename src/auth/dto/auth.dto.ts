import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Ada Lovelace' })
  name: string;

  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'name@example.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty({ description: 'Password (min 8 characters)', minLength: 8 })
  password: string;
}

export class LoginDto {
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'name@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User password' })
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Refresh token returned at login' })
  refreshToken: string;
}

export class LogoutDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Optional refresh token to revoke' })
  refreshToken?: string;
}
