import { Module } from '@nestjs/common'

import { PrismaModule } from '../../config/prisma/prisma.module'

import { ArticleController } from './article.controller'
import { ArticleService } from './article.service'

@Module({
  imports: [PrismaModule],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule {}
