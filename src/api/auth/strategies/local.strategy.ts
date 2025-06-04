import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { AuthService } from '../auth.service'
import { AuthPayloadDto } from '../dto/auth.dto'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(
    username: AuthPayloadDto['username'],
    password: AuthPayloadDto['password']
  ) {
    const user = await this.authService.validateUser({ username, password })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
