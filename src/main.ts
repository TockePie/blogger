import { NestFactory } from '@nestjs/core'
import chalk from 'chalk'

import { AppModule } from './app.module'

const PORT = process.env.PORT ?? 3000

void (async () => {
  const app = await NestFactory.create(AppModule)

  console.log(chalk.black.bgGreenBright(`Server is running on port: ${PORT}`))

  await app.listen(PORT)
})()
