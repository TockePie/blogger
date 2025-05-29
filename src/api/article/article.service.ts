import { UUID } from 'node:crypto'

import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../../config/prisma/prisma.service'

import { ArticleCreateDto } from './article.dto'

@Injectable()
export class ArticleService {
  constructor(private readonly prismaService: PrismaService) {}

  async getArticles(): Promise<ArticleCreateDto[]> {
    const articles = await this.prismaService.article.findMany()

    if (articles.length === 0) {
      throw new NotFoundException('No articles found')
    }

    return articles
  }

  async getArticleById(id: UUID): Promise<ArticleCreateDto> {
    const article = await this.prismaService.article.findUnique({
      where: {
        id
      }
    })

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`)
    }

    return article
  }

  async createArticle(body: ArticleCreateDto) {
    const authorExists = await this.prismaService.author.findUnique({
      where: {
        id: body.authorId
      }
    })

    if (!authorExists) {
      throw new NotFoundException(`Author with id ${body.authorId} not found`)
    }

    return this.prismaService.article.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: body.authorId
      }
    })
  }

  updateArticle(id: UUID, body: ArticleCreateDto) {
    return this.prismaService.article.update({
      where: {
        id
      },
      data: {
        title: body.title,
        content: body.content,
        authorId: body.authorId
      }
    })
  }

  async deleteArticle(id: UUID) {
    try {
      const article = await this.prismaService.article.findUnique({
        where: {
          id
        }
      })

      if (!article) {
        return new NotFoundException(`Article with id ${id} not found`)
      }

      return this.prismaService.article.delete({
        where: {
          id
        }
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error
      }
      return new Error('An unknown error occurred')
    }
  }
}
