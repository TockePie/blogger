import { UUID } from 'node:crypto'

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery
} from '@nestjs/swagger'

import { AuthUser } from '../auth/decorators/auth.decorator'

import { ArticleCreateDto, ArticleDto } from './dto/article.dto'
import { ArticleService } from './article.service'

@Controller('article')
export class ArticleController {
  constructor(private readonly article: ArticleService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all articles',
    description:
      'Retrieves a list of all available articles in the system. If an authorId is provided, it filters articles by that author.'
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    description: 'Optional author ID to filter articles by a specific author',
    type: String,
    format: 'uuid',
    example: 'ece86a9f-72cd-469f-9dc9-7c5ffeda27b0'
  })
  @ApiOkResponse({
    description: 'Array of all found articles',
    type: [ArticleDto]
  })
  @ApiNotFoundResponse({
    description: 'No articles found',
    example: {
      message:
        'No articles found for author with id ece86a9f-72cd-469f-9dc9-7c5ffeda27b0',
      error: 'Not Found',
      statusCode: 404
    }
  })
  async getArticles(@Query('authorId') authorId?: UUID): Promise<ArticleDto[]> {
    return this.article.getArticles(authorId)
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
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
  async createArticle(
    @Body() body: ArticleCreateDto,
    @AuthUser() user: { authorId: UUID }
  ): Promise<ArticleDto> {
    if (!user?.authorId) {
      throw new UnauthorizedException('Author ID not found in token')
    }

    return this.article.createArticle({
      ...body,
      authorId: user.authorId
    })
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
  async getArticleById(@Param('id') id: UUID): Promise<ArticleDto> {
    return this.article.getArticleById(id)
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Update an existing article',
    description: 'Updates the details of an existing article by its ID'
  })
  @ApiOkResponse({
    description: 'Article updated successfully',
    type: ArticleCreateDto
  })
  async updateArticle(
    @Param('id') id: UUID,
    @Body() body: ArticleCreateDto,
    @AuthUser() user: { authorId: UUID }
  ) {
    if (!user?.authorId) {
      throw new UnauthorizedException('Author ID not found in token')
    }

    return this.article.updateArticle(id, {
      ...body,
      authorId: user.authorId
    })
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
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
  async deleteArticle(
    @Param('id') id: UUID,
    @AuthUser() user: { authorId: UUID }
  ) {
    if (!user?.authorId) {
      throw new UnauthorizedException('Author ID not found in token')
    }

    return this.article.deleteArticle(id, user.authorId)
  }
}
