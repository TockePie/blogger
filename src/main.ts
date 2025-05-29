import { ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import chalk from 'chalk'

import { AppModule } from './api/app.module'
import { PrismaClientExceptionFilter } from './config/prisma-client-exception.filter'

const PORT = process.env.PORT ?? 4000
const API_PATH = process.env.API_PATH ?? '/api'

void (async () => {
  const app = await NestFactory.create(AppModule)
  const { httpAdapter } = app.get(HttpAdapterHost)

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization'
  })

  const config = new DocumentBuilder()
    .setTitle('Blogger API')
    .setDescription(
      'The Blogger API represents a blogging platform where users can create, read, update, and delete blog posts.'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(API_PATH, app, document, {
    jsonDocumentUrl: 'swagger/json'
  })

  console.log(chalk.black.bgGreenBright(`Server is running on port: ${PORT}`))
  console.log(chalk.blue(`Base URL: http://localhost:${PORT}`))
  console.log(chalk.blue(`OpenAPI docs: http://localhost:${PORT}${API_PATH}`))

  await app.listen(PORT)
})()
