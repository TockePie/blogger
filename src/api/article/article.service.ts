import { UUID } from 'node:crypto'

import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'

import { PrismaService } from '../../config/prisma/prisma.service'

import { ArticleCreateDto } from './dto/article.dto'

@Injectable()
export class ArticleService {
  constructor(private prismaService: PrismaService) {}

  async getArticles(authorId?: UUID) {
    if (authorId) {
      const authorExists = await this.prismaService.author.findUnique({
        where: {
          authorId
        }
      })

      if (!authorExists) {
        throw new NotFoundException(`Author with id ${authorId} not found`)
      }

      return await this.prismaService.article.findMany({
        where: {
          authorId
        }
      })
    }

    return await this.prismaService.article.findMany()
  }

  async createArticle(
    body: ArticleCreateDto & {
      authorId: UUID
    }
  ) {
    const authorExists = await this.prismaService.author.findUnique({
      where: {
        authorId: body.authorId
      }
    })
    if (!authorExists) {
      throw new NotFoundException(`Author with id ${body.authorId} not found`)
    }

    return await this.prismaService.article.create({
      data: {
        title: body.title,
        content: body.content,
        description: body.description,
        authorId: body.authorId
      }
    })
  }

  async getArticleById(articleId: UUID) {
    const article = await this.prismaService.article.findUnique({
      where: {
        articleId
      }
    })

    if (!article) {
      throw new NotFoundException(`Article with id ${articleId} not found`)
    }

    return article
  }

  async updateArticle(
    articleId: UUID,
    body: ArticleCreateDto & {
      authorId: UUID
    }
  ) {
    const article = await this.prismaService.article.findUnique({
      where: {
        articleId
      }
    })

    if (!article) {
      throw new NotFoundException(`Article with id ${articleId} not found`)
    }

    if (article.authorId !== body.authorId) {
      throw new UnauthorizedException(
        `Author with id ${body.authorId} does not match article's author`
      )
    }

    return await this.prismaService.article.update({
      where: {
        articleId
      },
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        tags: body.tags
      }
    })
  }

  async deleteArticle(articleId: UUID, authorId: UUID): Promise<void> {
    const article = await this.prismaService.article.findUnique({
      where: { articleId }
    })

    if (!article) {
      throw new NotFoundException(`Article with id ${articleId} not found`)
    }

    if (article.authorId !== authorId) {
      throw new UnauthorizedException(
        `Author with id ${authorId} does not match article's author`
      )
    }

    await this.prismaService.article.delete({ where: { articleId } })

    return
  }
}
