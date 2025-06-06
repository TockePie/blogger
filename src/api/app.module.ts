import { CacheModule } from '@nestjs/cache-manager'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { redisStore } from 'cache-manager-redis-store'

import { LoggerMiddleWare } from '../common/middlewares/logger.middleware'

import { ArticleModule } from './article/article.module'
import { AuthModule } from './auth/auth.module'
import { StartingModule } from './starting/starting.module'

@Module({
  imports: [
    ArticleModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          ttl: 60, // seconds
          socket: {
            host: config.get<string>('REDIS_HOST'),
            port: parseInt(config.get<string>('REDIS_PORT')!)
          }
        })

        return { store: () => store }
      },
      inject: [ConfigService]
    }),
    StartingModule,
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleWare).forRoutes('*')
  }
}
