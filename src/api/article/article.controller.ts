import { UUID } from 'node:crypto'

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation
} from '@nestjs/swagger'

import { ArticleCreateDto, ArticleDto } from './article.dto'
import { ArticleService } from './article.service'

@Controller('article')
export class ArticleController {
  constructor(private readonly article: ArticleService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all articles',
    description: 'Retrieves a list of all available articles in the system'
  })
  @ApiOkResponse({
    description: 'Array of all found articles',
    type: [ArticleDto]
  })
  @ApiNotFoundResponse({
    description: 'No articles found'
  })
  async getArticles() {
    return this.article.getArticles()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get concrete article by ID',
    description: 'Retrieves a specific article by its unique identifier'
  })
  @ApiOkResponse({
    description: 'Returns the article with the specified ID',
    type: ArticleDto
  })
  @ApiNotFoundResponse({
    description: 'Article with the specified ID not found'
  })
  async getArticleById(@Param('id') id: UUID) {
    return this.article.getArticleById(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new article',
    description: 'Creates a new article with the provided details'
  })
  @ApiCreatedResponse({
    description: 'Article created successfully',
    type: ArticleCreateDto
  })
  @ApiNotFoundResponse({
    description: 'Author with the specified ID not found'
  })
  createArticle(@Body() body: ArticleCreateDto) {
    return this.article.createArticle(body)
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing article',
    description: 'Updates the details of an existing article by its ID'
  })
  @ApiOkResponse({
    description: 'Article updated successfully',
    type: ArticleCreateDto
  })
  updateArticle(@Param('id') id: UUID, @Body() body: ArticleCreateDto) {
    return this.article.updateArticle(id, body)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an article',
    description: 'Deletes an article by its unique identifier'
  })
  @ApiOkResponse({
    description: 'Article deleted successfully'
  })
  @ApiNotFoundResponse({
    description: 'Article with the specified ID not found'
  })
  @ApiInternalServerErrorResponse({
    description: 'An unknown error occurred'
  })
  async deleteArticle(@Param('id') id: UUID) {
    return this.article.deleteArticle(id)
  }
}
