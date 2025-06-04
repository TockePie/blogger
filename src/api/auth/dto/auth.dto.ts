import { IsLowercase, IsNotEmpty, IsString } from 'class-validator'

export class AuthPayloadDto {
  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string
}
