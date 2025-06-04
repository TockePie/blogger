import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength
} from 'class-validator'

export class ArticleCreateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @ApiProperty({
    description: 'Title of the article',
    type: String,
    example: 'My First Article'
  })
  title: string

  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  @ApiProperty({
    description: 'Content of the article',
    type: String,
    example: `My first article is a significant milestone for any writer. To start, choose a topic that resonates with your interests and expertise, and conduct thorough research to gather relevant information. Create an outline, including an introduction, body paragraphs, and a conclusion, and use clear and concise language.`
  })
  content: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'A short description of the article',
    type: String,
    example: 'An introduction to writing articles',
    required: false
  })
  description?: string | null

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    description: 'Tags associated with the article',
    type: [String],
    example: ['introduction', 'writing', 'first article'],
    required: false
  })
  tags?: string[]
}

export class ArticleDto extends ArticleCreateDto {
  @ApiProperty({
    description: 'Unique identifier for the article',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID('4')
  articleId: string

  @ApiProperty({
    description: 'Author ID of the article',
    type: String,
    format: 'uuid',
    example: 'ece86a9f-72cd-469f-9dc9-7c5ffeda27b0'
  })
  @IsUUID('4')
  authorId: string

  @ApiProperty({
    description: 'Creation date of the article',
    type: String,
    format: 'date-time',
    example: '2023-10-01T12:00:00Z',
    required: false
  })
  @IsDateString()
  readonly createdAt: Date

  @ApiProperty({
    description: 'Last update date of the article',
    type: String,
    format: 'date-time',
    example: '2023-10-02T12:00:00Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  readonly updatedAt?: Date | null
}
