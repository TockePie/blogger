import { ConflictException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcrypt'

import { PrismaService } from '../../config/prisma/prisma.service'
import { AuthorCreateDto } from '../author/dto/author.dto'

import { AuthPayloadDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser({ username, password }: AuthPayloadDto) {
    const getUser = await this.prismaService.author.findFirst({
      where: {
        username
      }
    })
    if (!getUser) return null

    const getPassword = await this.prismaService.authorCredential.findFirst({
      where: {
        authorId: getUser.authorId
      }
    })
    if (!getPassword) return null

    const hashedPassword = getPassword?.password

    const isMatch = await compare(password, hashedPassword)
    if (!isMatch) return null

    return this.jwtService.sign(getUser)
  }

  async register(payload: AuthorCreateDto) {
    const existingUsername = await this.prismaService.author.findFirst({
      where: {
        username: payload.username
      }
    })

    if (existingUsername) {
      throw new ConflictException('Username already exists')
    }

    const existingEmail = await this.prismaService.author.findFirst({
      where: {
        email: payload.email
      }
    })

    if (existingEmail) {
      throw new ConflictException('Email already exists')
    }

    const newAuthor = await this.prismaService.author.create({
      data: {
        name: payload.name,
        surname: payload.surname,
        username: payload.username,
        email: payload.email
      }
    })

    const hashedPassword = await hash(payload.password, 10)

    await this.prismaService.authorCredential.create({
      data: {
        authorId: newAuthor.authorId,
        password: hashedPassword
      }
    })

    return this.jwtService.sign(newAuthor)
  }
}
