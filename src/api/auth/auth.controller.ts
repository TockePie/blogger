import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { Request } from 'express'

import { AuthorCreateDto } from '../author/dto/author.dto'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: 'Login to the system and get JWT token',
    description:
      'Authenticate user with username and password to receive a JWT token.'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'User username or email',
          example: 'username'
        },
        password: {
          type: 'string',
          description: 'User password',
          example: 'password123'
        }
      },
      required: ['username', 'password']
    }
  })
  @ApiCreatedResponse({
    description: 'Returns the user information upon successful login',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access. Invalid credentials provided.',
    example: {
      statusCode: 401,
      message: 'Unauthorized'
    }
  })
  login(@Req() req: Request) {
    return req.user
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user to the system and get JWT token',
    description:
      'Create a new user account with username, password, and other details to receive a JWT token.'
  })
  @ApiCreatedResponse({
    description: 'Returns the user information upon successful registration',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
  @ApiConflictResponse({
    description:
      'Conflict error. User with this username or email already exists.',
    example: {
      message: 'Username already exists',
      error: 'Conflict',
      statusCode: 409
    }
  })
  async register(@Body() payload: AuthorCreateDto): Promise<string> {
    return await this.authService.register(payload)
  }

  @Get('status')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get current user status',
    description: 'Returns the current authenticated user information.'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access. User is not authenticated.',
    example: {
      statusCode: 401,
      message: 'Unauthorized'
    }
  })
  getStatus(@Req() req: Request) {
    return { status: 'ok', message: 'You are authenticated', ...req.user }
  }
}
