import { UUID } from 'node:crypto'

import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform } from 'class-transformer'
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength
} from 'class-validator'

export class AuthorCreateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    description: 'First name of the author',
    type: String,
    example: 'John'
  })
  name: string

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    description: 'Last name of the author',
    type: String,
    example: 'Doe'
  })
  surname: string

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({
    description: 'Username of the author. Should be unique.',
    type: String,
    example: 'johndoe',
    uniqueItems: true
  })
  username: string

  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @ApiProperty({
    description: 'Email of the author. Should be unique.',
    type: String,
    example: 'john@example.com'
  })
  email: string

  @IsString()
  @IsNotEmpty()
  @Exclude()
  @ApiProperty({
    description:
      'Password of the author. Should be at least 6 characters long.',
    type: String,
    example: 'securepassword',
    minLength: 6
  })
  password: string
}

export class AuthorDto extends AuthorCreateDto {
  @ApiProperty({
    description: 'Unique identifier for the author',
    type: String,
    format: 'uuid',
    example: 'ece86a9f-72cd-469f-9dc9-7c5ffeda27b0'
  })
  @IsUUID('4')
  id: UUID

  @ApiProperty({
    description: 'Creation date of the author record',
    type: String,
    format: 'date-time',
    example: '2023-10-01T12:00:00Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  createdAt: string

  @ApiProperty({
    description: 'Last update date of the author record',
    type: String,
    format: 'date-time',
    example: '2023-10-02T12:00:00Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  updatedAt: string
}
