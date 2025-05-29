import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { LoggerMiddleWare } from '../common/middlewares/logger.middleware'

import { ArticleModule } from './article/article.module'
import { AuthorModule } from './author/author.module'
import { StartingModule } from './starting/starting.module'

@Module({
  imports: [
    ArticleModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }),
    StartingModule,
    AuthorModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleWare).forRoutes('*')
  }
}
